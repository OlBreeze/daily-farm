import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {API_ROUTES} from "@/services/apiConstants";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const PUBLIC_PATHS = ['/', '/login', '/register'];

    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }
    // Получаем токен из cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    console.log("Access token:", accessToken ? "present" : "missing");
    console.log("Refresh token:", refreshToken ? "present" : "missing");

    // Если нет ни одного токена
    if (!accessToken && !refreshToken) {
        if (isProtectedRoute(pathname)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    // Проверяем access token
    if (accessToken) {
        const isValidAccess = await validateToken(accessToken);

        if (isValidAccess) {
            // Access token валиден
            if (pathname === '/login' || pathname === '/register') {
                //return NextResponse.redirect(new URL('/account/navigator', request.url));
            }
            return NextResponse.next();
        }
    }
    // Access token невалиден или отсутствует, пытаемся обновить через refresh token
    if (refreshToken) {
        const refreshResult = await refreshAccessToken(refreshToken, request);

        if (refreshResult.success) {
            // Токен успешно обновлен
            const response = NextResponse.next();

            // Устанавливаем новые cookies
            if (refreshResult.newAccessToken) {
                response.cookies.set('accessToken', refreshResult.newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60, // 15 минут
                    path: '/',
                });
            }

            if (refreshResult.newRefreshToken) {
                response.cookies.set('refreshToken', refreshResult.newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60, // 7 дней
                    path: '/',
                });
            }

            if (pathname === '/login' || pathname === '/register') {
                //return NextResponse.redirect(new URL('/account/navigator', request.url));
            }

            return response;
        } else {
            // Refresh token тоже невалиден - очищаем cookies и редиректим
            const response = NextResponse.redirect(new URL('/login', request.url));
            clearAuthCookies(response);
            return response;
        }
    }


// Если дошли сюда - токены невалидны
    if (isProtectedRoute(pathname)) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        clearAuthCookies(response);
        return response;
    }

    return NextResponse.next();

}

// Функция валидации токена
async function validateToken(token: string): Promise<boolean> {
    //console.log("!!! token: " + token)
    try {
        const response = await fetch(API_ROUTES.AUTH_CHECK, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.ok;

    } catch (error) {
        return false;
    }
}

function isProtectedRoute(pathname: string): boolean {
    const protectedRoutes = ['/dashboard', '/profile'];  //'/account'
    return protectedRoutes.some(route => pathname.startsWith(route));
}

// Функция обновления токена
async function refreshAccessToken(
    refreshToken: string,
    request: NextRequest
): Promise<{
    success: boolean;
    newAccessToken?: string;
    newRefreshToken?: string;
}> {
    try {
        const response = await fetch(API_ROUTES.REFRESH, {
            method: 'POST',
            headers: {
                'Cookie': `refreshToken=${refreshToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Token refreshed successfully");

            return {
                success: true,
                newAccessToken: data.accessToken,
                newRefreshToken: data.refreshToken, // если бэкенд ротирует refresh токены
            };
        } else {
            console.log("Token refresh failed:", response.status);
            return { success: false };
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        return { success: false };
    }
}

// Функция очистки auth cookies
function clearAuthCookies(response: NextResponse) {
    const cookieOptions = {
        path: '/',
        expires: new Date(0), // Устанавливаем дату в прошлое
        httpOnly: true,
    };

    response.cookies.set('accessToken', '', cookieOptions);
    response.cookies.set('refreshToken', '', cookieOptions);
}

export const config = {
    matcher: [
        // Защищаем все маршруты, кроме api, _next/static, _next/image, favicon.ico
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

// Middleware выполняется на каждый HTTP запрос ПЕРЕД рендерингом страницы:
//     Запрос → Middleware → Страница/API
//
// Запускается на сервере (не в браузере)
// Выполняется до загрузки любого компонента
// Может изменить запрос, перенаправить или заблокировать доступ
// Работает только с cookie (не может читать localStorage)
