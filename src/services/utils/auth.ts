//auth.ts
//- утилиты для работы с авторизацией
import {API_ROUTES} from "@/services/apiConstants";
import {UserData} from "@/types/types";

export const registerUser = async (userData: UserData) => {
    try {
        console.log(JSON.stringify(userData));
        const response = await fetch(API_ROUTES.REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData),
        });
        console.log(response);
        if (!response.ok) {
            const errorData = await response.json();
            const message = errorData.message || 'Registration failed';
            throw new Error(message);
        }

        // 1 Проверяем, что ответ действительно JSON
        // const contentType = response.headers.get('content-type');
        // if (!contentType?.includes('application/json')) {
        //     const text = await response.text();
        //     throw new Error(`Expected JSON, got: ${text}`);
        // }


        // 2 Пытаемся парсить JSON только если есть контент
        // const responseText = await response.text();
        // if (responseText) {
        //     return JSON.parse(responseText);
        // } else {
        //     return { success: true }; // Если пустой ответ, но статус OK
        // }

        return await response.json();

    } catch (error) {
        console.error('Registration error:', error);
        throw error; // пробрасываем дальше в компонент
    }
};


export const logout = async () => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem('justLoggedOut', 'true');
        }

        await fetch(API_ROUTES.LOGOUT, {
            method: 'POST',
            credentials: 'include',
        });
        console.log("Logged out");
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    } finally {
       // window.location.href = '/'; // ← редирект всегда
    }
};

// Проверка авторизации на клиенте
export const checkAuth = async (): Promise<boolean> => {
    try {
        const res = await fetch(API_ROUTES.AUTH_CHECK, {
            credentials: 'include',
        });
        return res.ok;
    } catch {
        return false;
    }
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const refreshAccessToken = async (): Promise<boolean> => {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = fetch(API_ROUTES.REFRESH, {
        method: 'POST',
        credentials: 'include',
    }).then(res => {
        isRefreshing = false;
        return res.ok;
    }).catch(() => {
        isRefreshing = false;
        return false;
    });

    return refreshPromise;
};

// Функция для выполнения запросов с автоматическим обновлением токена
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let response = await fetch(url, {
        ...options,
        credentials: 'include',
    });

    // Если получили 401, пытаемся обновить токен
    if (response.status === 401) {
        const refreshSuccess = await refreshAccessToken();

        if (refreshSuccess) {
            // Повторяем запрос с новым токеном
            response = await fetch(url, {
                ...options,
                credentials: 'include',
            });
        }else {
            // Если refresh не удался - разлогиниваем
            await logout();
            throw new Error('Authentication failed');
        }
    }

    return response;
};