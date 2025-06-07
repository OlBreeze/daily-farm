'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/components/register.module.scss';
import {useAuth} from "@/services/hooks/useAuth";
import {UserData} from "@/types/types";
import {registerUser} from "@/services/utils/auth";

const RegisterPage = () => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth(); // Проверка авторизации

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [selected, setSelected] = useState('client');
    const [isSubmitting, setIsSubmitting] = useState(false); // Состояние отправки
    const [successMessage, setSuccessMessage] = useState(''); // Сообщение об успехе

    const minLength = 3;
    const maxLength = 20;

    // Редирект если пользователь уже авторизован
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/account/navigator');
        }
    }, [isAuthenticated, loading, router]);

    // Валидация пароля в реальном времени
    const validatePassword = (pass: string) => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumbers = /\d/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        if (pass.length < minLength) {
            return `Пароль должен содержать минимум ${minLength} символов`;
        }
        // if (!hasUpperCase) {
        //     return 'Пароль должен содержать заглавную букву';
        // }
        // if (!hasLowerCase) {
        //     return 'Пароль должен содержать строчную букву';
        // }
        // if (!hasNumbers) {
        //     return 'Пароль должен содержать цифру';
        // }
        // if (!hasSpecialChar) {
        //     return 'Пароль должен содержать специальный символ';
        // }
        return '';
    };

    // Валидация email
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Валидация username
    const validateUsername = (username: string) => {
        const validChars = /^[a-zA-Z0-9_-]+$/;

        if (username.length < minLength) {
            return 'Имя пользователя должно содержать минимум 3 символа';
        }
        if (username.length > maxLength) {
            return 'Имя пользователя не должно превышать 20 символов';
        }
        if (!validChars.test(username)) {
            return 'Имя пользователя может содержать только буквы, цифры, _ и -';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        // Клиентская валидация
        const usernameError = validateUsername(username);
        if (usernameError) {
            setError(usernameError);
            setIsSubmitting(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Введите корректный email адрес');
            setIsSubmitting(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setIsSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('The passwords do not match');
            setIsSubmitting(false);
            return;
        }

        const userData: UserData = {
            username: username.trim(),
            password,
            email: email.trim().toLowerCase(),
            client: selected === "client",
            company: selected !== "client"
        };

        try {
            const result = await registerUser(userData);
            console.log('Registration successful!', result);

            setSuccessMessage('Registration successful! Redirecting to login page...');

            // Очистка формы
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setSelected('client');

            // Перенаправление на страницу входа через 2 секунды
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            console.error(`Registration error:`, err);

            // Обработка различных типов ошибок
            if (err.message?.includes('username')) {
                setError('A user with this name already exists');
            } else if (err.message?.includes('email')) {
                setError('A user with this email already exists');
            } else if (err.status === 400) {
                setError('Incorrect data. Check the information you entered.');
            } else if (err.status === 500) {
                setError('Server error. Try again later.');
            } else {
                setError(err.message || 'An error occurred while registering');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value);
    };

    const handleBlur = () => {
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                setError('The passwords do not match');
            } else {
                setError('');
            }
        }
    };

    // Показываем загрузку пока проверяем авторизацию
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Если уже авторизован, не показываем форму
    if (isAuthenticated) {
        return null;
    }

    // Проверка готовности формы к отправке
    const isFormValid =
        username.trim().length >= 3 &&
        validateEmail(email) &&
        password.length >= minLength &&
        password === confirmPassword &&
        validatePassword(password) === '';

    return (
        <div className={styles.register}>
            <form className={styles.register__form} onSubmit={handleSubmit}>
                <h1 className={styles.register__title}>Register Form</h1>

                <div className={styles.register__field}>
                    <input
                        type="text"
                        placeholder="Username (3-20 символов)"
                        id="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isSubmitting}
                        required
                        minLength={3}
                        maxLength={20}
                    />
                </div>

                <div className={styles.register__field}>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div className={styles.register__field}>
                    <input
                        type="password"
                        placeholder={`Password (мин. ${minLength} символов)`}
                        required
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        minLength={minLength}
                    />
                </div>

                <div className={styles.register__field}>
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        required
                        id="password2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.register__field}>
                    <select
                        value={selected}
                        onChange={handleSelectChange}
                        className={styles.register__select}
                        name="clientCompany"
                        disabled={isSubmitting}
                        required
                    >
                        <option value="client">Client</option>
                        <option value="company">Company</option>
                    </select>
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}

                <div className={styles.register__actions}>
                    <input
                        type="submit"
                        value={isSubmitting ? "Регистрация..." : "Register"}
                       disabled={!isFormValid || isSubmitting}
                    />

                    <p className={styles.register__login}>
                        Уже есть аккаунт? <a href="/login">Войти</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;