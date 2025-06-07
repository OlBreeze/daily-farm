'use client';

import { useState } from 'react';
import { Order } from '@/types/types';
import { API_ROUTES } from '@/services/apiConstants';
import {authenticatedFetch} from "@/services/utils/auth";

interface OrderEditFormProps {
    order: Order;
    onOrderUpdate: (order: Order) => void;
}

export default function OrderEditForm({ order, onOrderUpdate }: OrderEditFormProps) {
    const [editedOrder, setEditedOrder] = useState<Order>(order);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleStatusChange = (newStatus: "NEW" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED") => {
        setEditedOrder(prev => ({
            ...prev,
            statusDelivery: newStatus
        }));
    };

    const isValidStatus = (status: string): status is "NEW" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED" => {
        return ['NEW', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'].includes(status);
    };

    const handleProductQuantityChange = (productId: string, newQuantity: number) => {
        setEditedOrder(prev => ({
            ...prev,
            products: prev.products?.map(product =>
                product.productId === productId
                    ? { ...product, quantity: newQuantity }
                    : product
            ) || []
        }));
    };

    const calculateTotal = () => {
        return editedOrder.products?.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0) || 0;
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setSaveError(null);
            setSaveSuccess(false);

            const orderToSave = {
                ...editedOrder,
                totalSum: calculateTotal()
            };

            const response = await authenticatedFetch(`${API_ROUTES.UPDATE_ORDER}${order.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderToSave),
            });

            if (!response.ok) {
                throw new Error(`Ошибка сохранения: ${response.status}`);
            }

            const updatedOrder = await response.json();
            onOrderUpdate(updatedOrder);
            setEditedOrder(updatedOrder);
            setSaveSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving order:', error);
            setSaveError(error instanceof Error ? error.message : 'Ошибка сохранения');
        } finally {
            setSaving(false);
        }
    };

    const deliveryStatuses: Array<"NEW" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED"> = [
        'NEW',
        'IN_PROGRESS',
        'DELIVERED',
        'CANCELLED'
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Status Section */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус доставки
                </label>
                <select
                    value={editedOrder.statusDelivery}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (isValidStatus(value)) {
                            handleStatusChange(value);
                        }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {deliveryStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Payment Info */}
            <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">Дата оплаты:</span>
                    <span>
                        {editedOrder.datePayment
                            ? new Date(editedOrder.datePayment).toLocaleDateString()
                            : 'Не оплачен'
                        }
                    </span>
                </div>
            </div>

            {/* Products Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Товары в заказе</h3>
                <div className="space-y-3">
                    {editedOrder.products?.map(product => (
                        <div key={product.productId} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                            <div className="flex-grow">
                                <h4 className="font-medium">{product.productName}</h4>
                                <p className="text-sm text-gray-600">Цена: ${product.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium">Количество:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={product.quantity}
                                    onChange={(e) => handleProductQuantityChange(
                                        product.productId,
                                        parseInt(e.target.value) || 1
                                    )}
                                    className="w-20 p-1 border border-gray-300 rounded text-center"
                                />
                                <span className="text-sm font-medium">
                                    = ${(product.price * product.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Общая сумма:</span>
                    <span className="text-xl font-bold text-blue-600">
                        ${calculateTotal().toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Save Button and Messages */}
            <div className="space-y-3">
                {saveError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                        {saveError}
                    </div>
                )}

                {saveSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                        Заказ успешно обновлен!
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {saving && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>

                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                    >
                        Назад к списку
                    </button>
                </div>
            </div>
        </div>
    );
}