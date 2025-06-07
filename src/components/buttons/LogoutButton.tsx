'use client';
import { logout } from '@/services/utils/auth';
import {useAuth} from "@/services/hooks/useAuth";

interface LogoutButtonProps {
    className: string;
    children?: React.ReactNode;
}

const LogoutButton = ({ className, children }: LogoutButtonProps) => {
    const { setIsAuthenticated, setLoading } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // ВАЖНО: Сначала ставим флаг
            localStorage.setItem('justLoggedOut', 'true');

            // Очищаем куки с токенами
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            setIsAuthenticated(false);
            setLoading(false);
            window.location.href = '/';
        } catch (error) {
            // Очищаем куки с токенами
            localStorage.setItem('justLoggedOut', 'true');
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setIsAuthenticated(false);
            setLoading(false);
            window.location.href = '/';
        }
    };

    return (
        <button onClick={handleLogout} className={className}>
            {children || 'Выйти'}
        </button>
    );
};



export default LogoutButton;
