'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ProductCart = {
    id: string;
    title: string;
    src: string;
    price: number;
    quantity: number;
};

type CartContextType = {
    arrayCart : ProductCart[];
    addToCart: (product: ProductCart) => void;
    deleteFromCart: (product: ProductCart) => void;
    clearCart: (product: ProductCart) => void;
    clearAllCart:()=>void
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [arrayCart , setCartItems] = useState<ProductCart[]>([]);

    const addToCart = (product: ProductCart) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);

            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };
    const clearCart = (product: ProductCart)=>{
        setCartItems([]); // вообще не понятно что делает эта функция, проверить (один продукт удалить?)
    }
    const clearAllCart = (): void => {
        setCartItems([]);
    };

    const deleteFromCart = (product: ProductCart) => {
        setCartItems(prev => {
            return prev
                .map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0);
        });
    };

    return (
        <CartContext.Provider value={{ arrayCart , addToCart, deleteFromCart, clearCart, clearAllCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
