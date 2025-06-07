'use client'
import styles from '../../styles/components/header.module.scss';
import Link from "next/link";
import {usePathname} from "next/navigation";
import HeaderSearch from "@/components/header/headerSearch";

const Header = () => {
    const pathname = usePathname();

    return (
        <header>
            <div className={styles.header}>
                <div className={styles.header__wrapper}>
                    <nav className={styles.header__nav_top}>
                        <ul className={styles.header__menu}>
                            <li><Link href="/" className={pathname === '/' ? styles.header__activeLink : ''}>Home</Link>
                            </li>
                            {/* ведёт на Home (page.tsx) */}
                            <li><Link href="/contact"
                                      className={pathname === '/contact' ? styles.header__activeLink : ''}>Contact
                                us</Link></li>
                            <li><Link href="/payment_delivery"
                                      className={pathname === '/payment_delivery' ? styles.header__activeLink : ''}>Payment
                                and delivery</Link></li>
                        </ul>
                        <ul className={styles.header__lang}>
                            <li><a className="link" href="">HEB</a></li>
                            <li><a className="link" href="">ENG</a></li>
                            <li><a className="link" href="">RU</a></li>
                        </ul>
                        <button className="button" type="button">Request a call</button>
                    </nav>
                </div>
                <HeaderSearch/>
            </div>
        </header>
    )
};
export default Header;

