'use client';
import {useState} from 'react';
import {Order, Product} from "@/types/types";
import {useRouter} from "next/navigation";
import {API_ROUTES} from "@/services/apiConstants";
import {authenticatedFetch} from "@/services/utils/auth";

interface EditOrderPageProps {
    initialOrder: Order;
}

export default function OrderPage({initialOrder}: EditOrderPageProps) {
    const [order, setOrder] = useState<Order>(initialOrder);
    const router = useRouter();

    const handleFieldChange = (field: keyof Order, value: any) => {
        setOrder({...order, [field]: value});
    };

    const handleProductChange = (index: number, field: keyof Product, value: any) => {
        //console.log("" + index + " " + field);
        const updatedProducts = [...order.products];
        updatedProducts[index] = {...updatedProducts[index], [field]: value};
        setOrder({...order, products: updatedProducts});
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //console.log(order.products);

        const res = await authenticatedFetch(`${API_ROUTES.UPDATE_ORDER}${order.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(order),
            credentials:"include",
        });

        if (res.ok) {
            router.push('/account/list-orders');
        } else {
            alert('Error creating order');
        }
    };
    const handleDelete = async () => {
        const res = await authenticatedFetch(`${API_ROUTES.REMOVE_ORDER}${order.id}`, {
            method: 'DELETE',
            credentials:"include",
        });

        if (res.ok) {
            router.push('/account/list-orders');
        } else {
            // setError('Error deleting order');
        }
    };

    return (
        <form onSubmit={handleSave}>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold">Editing an order</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Delivery status</label>
                        <select
                            className="mt-1 block w-full border rounded-md p-2"
                            value={order.statusDelivery}
                            onChange={(e) => handleFieldChange('statusDelivery', e.target.value)}
                        >
                            <option value="NEW">NEW</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comment</label>
                        <textarea
                            className="mt-1 block w-full border rounded-md p-2"
                            value={order.comment}
                            onChange={(e) => handleFieldChange('comment', e.target.value)}
                        />
                    </div>

                    <h2 className="text-xl font-semibold mt-6">Products</h2>

                    <table className="min-w-full border divide-y divide-gray-300 bg-gray-150">
                        <thead className="bg-gray-150">
                        <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Comment</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.products && order.products.length > 0 && (
                            <div>
                                {order.products.map((product, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                                        <td className="p-2">
                                            <input disabled
                                                   className="w-full border p-1 rounded bg-blue-50"
                                                   value={product.productName}
                                                   onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input disabled
                                                   type="number"
                                                   className="w-full border p-1 rounded"
                                                   value={product.price}
                                                   onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                className="w-full border p-1 rounded"
                                                value={product.quantity}
                                                onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                className="w-full border p-1 rounded"
                                                value={product.comment || ""}
                                                onChange={(e) => handleProductChange(index, 'comment', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </div>)}
                        </tbody>
                    </table>

                    <div className="pt-4 flex gap-2.5">
                        <button type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-850 transition"
                        >
                            Save order
                        </button>
                        <button type="button"
                                onClick={handleDelete}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-850 transition"
                        >
                            Delete order
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
