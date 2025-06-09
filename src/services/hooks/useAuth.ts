'use client';
import { useState, useEffect, useCallback } from 'react';
import { checkAuth } from '../utils/auth';

export const useAuth = (): {
    isAuthenticated: boolean | null;
    loading: boolean;
    verifyAuth: () => Promise<void>;
    setIsAuthenticated: (value: boolean | null) => void;
    setLoading: (value: boolean) => void;
} => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    const verifyAuth = useCallback(async () => {
        setLoading(true);

        // Проверяем флаг logout ПЕРВЫМ делом
        if (typeof window !== 'undefined' && localStorage.getItem('justLoggedOut') === 'true') {
            localStorage.removeItem('justLoggedOut');
            setIsAuthenticated(false);
            setLoading(false);
            return; // НЕ делаем checkAuth()
        }

        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
        setLoading(false);
    }, []);

    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    return { isAuthenticated, loading, verifyAuth, setIsAuthenticated , setLoading};
};
