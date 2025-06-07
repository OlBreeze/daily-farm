'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from '@/types/types';
import {API_ROUTES} from "@/services/apiConstants";
import {authenticatedFetch} from "@/services/utils/auth";

export default function ListOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

        useEffect(() => {
            const fetchProducts = async () => {
                const res = await authenticatedFetch(API_ROUTES.GET_ALL_ORDERS, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                    credentials: "include",
                });
                const data = await res.json();

                setOrders(data);
            };
            fetchProducts().then(r => console.log("01 Ok"))
                .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold text-red-900 mb-6 text-center underline">My Orders</h1>
            {orders && orders.length > 0 && (
            <div className="grid gap-4">
               {orders.map(order => (
                    <div key={order.id}>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold">Order № {order.id}</h2>
                                <h2 className="text-xl font-semibold">Status: {order.statusDelivery}</h2>
                                <h2 className="text-xl font-semibold">Paid: {order.datePayment != null? new Date(order.datePayment).toLocaleDateString() : '—'}</h2>
                                <Link href={`/orders/update/${order.id}`}>
                                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-850 transition">
                                        View / Edit
                                    </button>
                                </Link>
                            </div>
                            {order.products && order.products.length > 0 && (
                            <div className="space-y-2">
                            {order.products.map(product => (
                                    <div key={product.productId} className="flex justify-between">
                                        <span className="text-xl font-semibold">{product.productName}</span>
                                        <span>count:{product.quantity}</span>
                                        <span>sum : {product.price}</span>
                                    </div>
                                ))}
                            </div>
                            )}
                            <div className="text-right font-bold mt-2">
                                Total: ${order.totalSum.toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
}
