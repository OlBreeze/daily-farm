'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {useCart} from "@/app/context/CartContext";
import {API_ROUTES} from "@/services/apiConstants";
import {authenticatedFetch} from "@/services/utils/auth";

const Cart = () => {
    const {  arrayCart, deleteFromCart, clearCart, clearAllCart } = useCart();
    const router = useRouter();

    const totalSum = arrayCart.reduce((sum, item) => sum + Number(item.price), 0);

    const handleCheckout = async () => {
        const orderRequest = {
            order: {
                // userId: "6ee3b677-95b0-491e-828c-1e3f6927e990", // получим на бэкенде из токена
                comment: "Комментарий к заказу 1",
                //totalSum: totalSum
            },
            products: arrayCart.map(item => ({
                productId: item.id,
                price: item.price,
                quantity: item.quantity,
                comment: "comment 1",
            }))
        };

      //  console.log(orderRequest);
        const res = await authenticatedFetch(`${API_ROUTES.ADD_ORDER}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(orderRequest),
            credentials:"include",
        });

        console.log(res);
        console.log(res.status);
        if (res.ok) {
            clearAllCart();
            router.push('/account/list-orders');
        } else {
            if (res.status === 401) {
                router.push('/login');
                return;
            }
            let errorMessage = 'Ошибка при оформлении заказа.';

            try {
                const errorData = await res.json(); // читаем тело ответа
                if (errorData && errorData.message) {
                    errorMessage = errorData.message; // используем сообщение с бэка
                } else {
                    // Если поле message отсутствует, можно посмотреть статус
                    switch (res.status) {
                        // case 401:
                        //     errorMessage = 'Вы не авторизованы. Пожалуйста, войдите в аккаунт.';
                        //     break;
                        case 403:
                            errorMessage = 'Доступ запрещён.';
                            break;
                        case 400:
                            errorMessage = 'Некорректные данные.';
                            break;
                        case 500:
                            errorMessage = 'Ошибка сервера. Попробуйте позже.';
                            break;
                    }
                }
            } catch {
                // Не удалось распарсить JSON — оставляем дефолтное сообщение
            }

            alert(errorMessage);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your cart</h1>

            {arrayCart.length === 0 ? (
                <p className="text-center text-gray-500">The cart is empty.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {arrayCart.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between bg-white p-4 shadow rounded-xl"
                            >
                                <div className="flex items-center space-x-4">
                                    <img src={item.src} alt={item.title} className="w-16 h-16 object-cover rounded-md"/>
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.title}</h2>
                                        <p className="text-gray-600">{item.price}</p>
                                    </div>

                                </div>
                                <p>Count: {item.quantity}</p>
                                <button
                                    onClick={() => deleteFromCart(item)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    ✖ Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex justify-between items-center">
                        <span className="text-xl font-bold">Total: {totalSum}V</span>
                        <button
                            onClick={handleCheckout}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            Place an order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
