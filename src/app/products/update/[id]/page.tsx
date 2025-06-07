'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import ProductPage from '@/components/products/ProductPage';
import styles from "@/styles/components/updatePage.module.scss";
import {Category, Product, Unit} from "@/types/types";
import {API_ROUTES} from "@/services/apiConstants";
import {authenticatedFetch} from "@/services/utils/auth";

interface Props {
    params: Promise<{ id: string }>;
}

export default function Page(props: Props) {
    const params = use(props.params);
    const { id } = params;
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [categories, setCategory] = useState<Category[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const resProduct = await authenticatedFetch(`${API_ROUTES.GET_PRODUCT_ID}${id}`);
            const productData = await resProduct.json();

            const resUnits = await fetch(`${API_ROUTES.GET_ALL_UNITS}` );
            const unitsData = await resUnits.json();

            const resCategories = await fetch(`${API_ROUTES.GET_ALL_CATEGORIES}`);
            const categoryData = await resCategories.json();

            setProduct(productData);
            setUnits(unitsData);
            setCategory(categoryData);
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleCancel = () => {
        router.push('/account/product-management');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //console.log(product);
        const res = await authenticatedFetch(`${API_ROUTES.UPDATE_PRODUCT}${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
            credentials: "include",
        });

        if (res.ok) {
            router.push('/account/product-management');
        } else {
            setError('Error updating product');
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className={styles.updatePage}>
            <ProductPage
                product={product}
                units={units}
                categories={categories}
                onChange={handleChange}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                error={error}
                title="Edit Product"
            />
        </div>
    );
}
