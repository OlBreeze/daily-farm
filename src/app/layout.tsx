import type {Metadata} from "next";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";
import '../styles/main.scss';
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import {CartProvider} from "@/app/context/CartContext";
import React, {Suspense} from "react";

export const metadata: Metadata = {
    title: "Daily FARM",
    description: "A marketplace for farming and agricultural products",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>

        <CartProvider>
            <Suspense fallback={<div>Загрузка...</div>}>
                <Header />
            </Suspense>
                <div className={"page-container"}>
                    {children}
                </div>
            <Footer/>
        </CartProvider>

        </body>
        </html>
    );
}
