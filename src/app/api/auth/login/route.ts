// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {API_ROUTES} from "@/services/apiConstants";

// Извлекаем exp из JWT
function getJwtExpiration(token: string): Date | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Запрос на ваш бэкенд
        const backendResponse = await fetch(API_ROUTES.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json().catch(() => ({}));
            return NextResponse.json(
                { message: errorData.message || 'Invalid credentials' },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        const response = NextResponse.json({ message: 'Login successful' });

        // Устанавливаем cookies с правильным временем истечения
        if (data.accessToken) {
            const expires = getJwtExpiration(data.accessToken) || new Date(Date.now() + 60 * 60 * 1000);
            response.cookies.set('accessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires,
                path: '/',
            });
        }

        if (data.refreshToken) {
            const expires = getJwtExpiration(data.refreshToken) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            response.cookies.set('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires,
                path: '/',
            });
        }

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}