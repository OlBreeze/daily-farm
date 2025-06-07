//import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: "admin"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials: Record<"username" | "password", string> | undefined, req) {
                // логика проверки пользователя
                // тут твоя логика логина — отправляем данные на сервер и получаем user + token
                // const res = await fetch("http://localhost:3000/api/login", {
                //     method: "POST",
                //     body: JSON.stringify(credentials),
                //     headers: { "Content-Type": "application/json" }

                if (credentials?.username === "admin" && credentials.password === "pass") {
                    return {id: "1", name: "Admin", email: "admin@example.com", role: "admin"};
                }
                return null;
            },
        }),
    ],
    // другие опции (например, callbacks, session и т.д.)
    pages: {
        signIn: '/login', //  страница логина
        error: '/login'
    },

    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;
            session.user.role = token.role; // <-- добавляем роль
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // <-- сохраняем роль в токен
                token.accessToken = user.accessToken;  // из ответа сервера
            }
            return token;
        }
    }
// session: {
//     strategy: "jwt", // JWT сессии (рекомендуется для CredentialsProvider)
// },

}