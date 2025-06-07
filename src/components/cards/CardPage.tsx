import Image from "next/image";
import styles from '../../styles/components/card.module.scss';
import {useRouter} from "next/navigation";
import {useCart} from "@/app/context/CartContext";
import {Product} from "@/types/types";
import {authenticatedFetch} from "@/services/utils/auth";
import {API_ROUTES} from "@/services/apiConstants";

interface CardPageProps {
    id: string ;
    product:Product;
    imageSrc: string;
    title: string;
    price: number;
    quantity: number;
    isAdmin: boolean;
    onDelete: (id: string) => void;
}

const CardPage: React.FC<CardPageProps> = ({ id,product, imageSrc, title, price, quantity, isAdmin, onDelete  }) => {
    const router = useRouter();
    const { addToCart } = useCart();

    const handleUpdate = () => {
        router.push(`/products/update/${id}`);
    };

    const handleAddToCart = () => {
        addToCart({
            id,
            title,
            src: imageSrc,
            price,
            quantity
        });
    };

    const handleDelete = async () => {
        try {
           // console.log("1.QQQ: " + id)
            const res = await authenticatedFetch(`${API_ROUTES.REMOVE_PRODUCT}${id}` , {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok)
                throw new Error('Failed to delete product');

            onDelete(id);
        } catch (err: any) {
            alert(err.message);
        }
    }
   return  (
        <li className={styles.cards__item}>
            <article className={styles.card}>
                <a href="#">
                    <Image
                        className={styles.card__img}
                        src={imageSrc}
                        alt={title}
                        width={300}
                        height={200}
                    />
                </a>
                <div className={styles.card__title}>{title}</div>
                <div className={styles.card__price}>{price}</div>

                {isAdmin ? (
                    <div className={styles.card__btnUpdateDelete}>
                        <button className={styles.card__btnAdd} type="button" data-id={id} onClick={handleUpdate}>Edit</button>
                        <button className={styles.card__btnAdd} type="button" data-id={id} onClick={handleDelete}>Delete</button>
                    </div>
                ) : (
                    <button className={styles.card__btnAdd} type="button" data-id={id} onClick={handleAddToCart}>Add to cart</button>
                )}

            </article>
        </li>
    );
}

export default CardPage;
