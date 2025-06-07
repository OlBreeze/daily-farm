'use client';

import React, {useEffect, useState} from 'react';
import styles from "@/styles/components/updatePage.module.scss";
import { Product, Unit, Category } from '@/types/types';


interface ProductFormProps {
    product: Product;
    units: Unit[];
    categories: Category[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
    error?: string;
    title: string;
}

export default function ProductPage({
                                        product,
                                        units,
                                        categories,
                                        onChange,
                                        onCancel,
                                        onSubmit,
                                        error,
                                        title,
                                    }: ProductFormProps) {

    const createChangeEvent = (name: string, value: string): React.ChangeEvent<HTMLSelectElement> => ({
        target: { name, value }
    } as React.ChangeEvent<HTMLSelectElement>);

    useEffect(() => {
        //console.log("product.id - "+product.id +" : "+ !product.id);
        if (!product.id) {
            if (categories.length > 0 && !product.categoryId) {
                onChange(createChangeEvent('categoryId', categories[0].id));
            }
            if (units.length > 0 && !product.unitId) {
                onChange(createChangeEvent('unitId', units[0].id));
            }
        }
    }, [product.id, categories, units, product.categoryId, product.unitId, onChange]);

    return (
        <form className={styles.updatePage__form} onSubmit={onSubmit}>
            <h1 className={styles.updatePage__title}>{title}</h1>

            <div className={styles.updatePage__field}>
                <label htmlFor="categoryId">Category:</label>
                <select name="categoryId"  value={product.categoryId ||  (categories.length > 0 ? categories[0].id : '')} onChange={onChange}
                        className={styles.updatePage__select}>
                        {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.updatePage__field}>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" value={product.name} onChange={onChange} autoComplete="off"/>
            </div>

            <div className={styles.updatePage__field}>
                <label htmlFor="price">Price:</label>
                <input type="number" name="price" value={product.price} onChange={onChange}/>
            </div>

            <div className={styles.updatePage__blockQuantity}>
                <div className={styles.updatePage__field}>
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" name="quantity" value={product.quantity} onChange={onChange}/>
                </div>

                <div className={styles.updatePage__field}>
                    <label htmlFor="unitId">Unit:</label>
                    <select name="unitId" value={product.unitId||  (units.length > 0 ? units[0].id : '')} onChange={onChange}
                            className={styles.updatePage__select}>
                        {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.updatePage__field}>
                <label htmlFor="comment">Description:</label>
                <textarea name="comment" value={product.comment} onChange={onChange} maxLength={255}></textarea>
            </div>

            {error && <p style={{color: 'red'}}>{error}</p>}

            <div className={styles.updatePage__actions}>
                <button type="button" onClick={onCancel}>Cancel</button>
                <button type="submit">Save</button>
            </div>
        </form>
    );
}
