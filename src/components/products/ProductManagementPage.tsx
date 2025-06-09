'use client';
import styles from "@/styles/components/productManagement.module.scss";
import {useRouter} from "next/navigation";
import CardListPages from "@/components/cards/CardListPages";
import {Suspense} from "react";


const ProductManagementPage = () => {
    const router = useRouter();
    const addNewItem = () => {
        router.push('/products/new');
    };

    return (
        <div className={styles.productManagement}>
            <button  onClick={addNewItem}>Add new item</button>
            {/*<Suspense fallback={<div>Загрузка карточек...</div>}>*/}
                <CardListPages tempIsAdmin={true} />
            {/*</Suspense>*/}
        </div>
    );
};

export default ProductManagementPage;