'use client';
import CardPage from "@/components/cards/CardPage";
import styles from '../../styles/components/cardList.module.scss';
import {useEffect, useState} from "react";
import {Product} from "@/types/types";

const CardList = ({products, tempIsAdmin}: { products: Product[], tempIsAdmin: boolean }) => {
    const [innerProducts, setProducts] = useState<Product[]>(products);

    const isAdmin = tempIsAdmin; //session?.user?.role === 'admin'; !!!

    useEffect(() => {
        setProducts(products);
    }, [products]);

    const handleDelete = (id: string) => {
        setProducts((prev) => prev.filter(product => product.id !== id));
    };

    return (
        <ul className={styles.cardsList}>
                {innerProducts.map(product => (
                    <CardPage
                        key={product.id}
                        id={product.id}
                        product = {product}
                        imageSrc="/images/goods/tea.jpg"//{product.imageSrc}
                        title={product.name}
                        quantity={product.quantity}
                      //  price={`${product.price.toFixed(2)}`}
                        price={product.price}
                        isAdmin={isAdmin}
                        onDelete={handleDelete}
                    />
                ))}
        </ul>
    );
};

export default CardList;