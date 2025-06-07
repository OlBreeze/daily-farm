'use client'
import styles from '../styles/components/login.module.scss';
import Link from "next/link";
import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import { useAuth } from '@/services/hooks/useAuth';
import {API_ROUTES} from "@/services/apiConstants";

const LoginPageAuth = () => {
    const router = useRouter();
    const { isAuthenticated, loading, setIsAuthenticated, setLoading } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Если пользователь уже авторизован, перенаправляем
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/account/navigator');
        }
    }, [isAuthenticated, loading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(API_ROUTES.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                setLoading(false);
               // router.replace('/account/navigator');
                router.push('/account/navigator');
            } else {
                const err = await res.json();
                setError(err.message || 'Invalid credentials');
                return;
            }


        } catch (err) {
            setError('Ошибка при подключении к серверу');
        }
    };

    // Показываем загрузку пока проверяем авторизацию
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Если уже авторизован, не показываем форму
    //console.log("isAuthenticated " + isAuthenticated)
    if (isAuthenticated) {
    //    router.replace('/account/navigator');
        return null;
    }

    return (
        <div className={styles.loginContainer}>
            <section className={styles.loginContainer__content} id="content">
                <form className={styles.loginContainer__form} onSubmit={handleLogin}>
                    <h1>Login Form</h1>
                    <div>
                        <input type="text" placeholder="Username" required id="username" value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div>
                        <input type="password" placeholder="Password" required id="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <input type="submit" value="Log in"/>
                        <a href="#">Lost your password?</a>
                        <Link href="/register">Register</Link>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </section>
        </div>
    );
};

export default LoginPageAuth;