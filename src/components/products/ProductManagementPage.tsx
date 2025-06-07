'use client';
import styles from "@/styles/components/productManagement.module.scss";
import {useRouter} from "next/navigation";
import CardListPages from "@/components/cards/CardListPages";


const ProductManagementPage = () => {
    const router = useRouter();
    const addNewItem = () => {
        router.push('/products/new');
    };

    return (
        <div className={styles.productManagement}>
            <button  onClick={addNewItem}>Add new item</button>
            <CardListPages tempIsAdmin = {true}/>
        </div>
    );
};

export default ProductManagementPage;