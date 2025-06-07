'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Order } from '@/types/types';
import { API_ROUTES } from '@/services/apiConstants';
import OrderEditForm from '@/components/orders/OrderEditForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import {authenticatedFetch} from "@/services/utils/auth";

export default function OrderUpdatePage() {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await authenticatedFetch(`${API_ROUTES.GET_ORDER_ID}${orderId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Заказ не найден');
                    } else if (response.status === 401) {
                        setError('Ошибка авторизации. Пожалуйста, войдите в систему');
                    } else {
                        setError(`Ошибка загрузки заказа: ${response.status}`);
                    }
                    return;
                }

                const orderData = await response.json();

                if (!orderData || !orderData.id) {
                    setError('Некорректные данные заказа');
                    return;
                }

                setOrder(orderData);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Ошибка сети. Проверьте подключение к интернету');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message={error} />
                <button
                    onClick={() => window.history.back()}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Назад
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700">Заказ не найден</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Редактирование заказа № {order.id}</h1>
                <p className="text-gray-600 mt-2">
                    Статус: {order.statusDelivery} |
                    Оплачен: {order.datePayment ? new Date(order.datePayment).toLocaleDateString() : 'Не оплачен'}
                </p>
            </div>

            <OrderEditForm
                order={order}
                onOrderUpdate={setOrder}
            />
        </div>
    );
}