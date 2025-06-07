'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductPage from '@/components/products/ProductPage';
import styles from "@/styles/components/updatePage.module.scss";
import { Product, Unit, Category } from '@/types/types';
import {API_ROUTES} from "@/services/apiConstants";
import {authenticatedFetch} from "@/services/utils/auth";


export default function Page() {
    const router = useRouter();

    const [product, setProduct] = useState<Product>({
        imageSrc: "",
        id:'',
        name: '',
        comment: '',
        price: 0,
        quantity: 0,
        unitId: '',
        categoryId: '',
        userId:''
    });

    const [units, setUnits] = useState<Unit[]>([]);
    const [categories, setCategory] = useState<Category[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUnits = async () => {
            const resUnits = await fetch(API_ROUTES.GET_ALL_UNITS);
            const unitsData = await resUnits.json();
            setUnits(unitsData);
        };
        const fetchCategories = async () => {
            const resCategories = await fetch(API_ROUTES.GET_ALL_CATEGORIES);
            const categoriesData = await resCategories.json();
            setCategory(categoriesData);
        };
        fetchUnits();
        fetchCategories();

    }, []);

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

        const res = await authenticatedFetch(API_ROUTES.ADD_PRODUCT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
            credentials: 'include',
        });
        if (res.ok) {
            router.push('/account/product-management');
        } else {
            setError('Error creating product');
        }
    };

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
                title="Create New Product"
            />
        </div>
    );
}
