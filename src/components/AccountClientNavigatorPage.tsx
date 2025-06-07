import styles from '../styles/components/account-nav.module.scss';
import Link from "next/link";

const AccountClientNavigatorPage = () => {
    return (
        <div className={styles.accountNav}>
            <ul className={styles.accountNav__menu}>
                <li className={styles.accountNav__item}>
                    <Link href="/account/user-setup" className={styles.accountNav__activeLink}>
                        User settings
                    </Link>
                </li>
                <li className={styles.accountNav__item}>
                    <Link href="/account/product-management" className={styles.accountNav__activeLink}>
                        Managing of products
                    </Link>
                </li >
                <li className={styles.accountNav__item}>
                    <Link href="/account/list-orders" className={styles.accountNav__activeLink}>
                        List of orders
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default AccountClientNavigatorPage;