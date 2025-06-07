'use client';

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import styles from "@/styles/components/header.module.scss";
import Image from "next/image";
import Link from "next/link";
import {useCart} from "@/app/context/CartContext";

const HeaderSearch = () => {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('search') || '');
    const router = useRouter();
    const { arrayCart } = useCart();
    const pathname = usePathname();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        params.set('search', query);
        params.set('page', '1'); // сбрасываем на первую страницу
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div>
            <nav className={styles.header__nav_search}>
                <form onSubmit={handleSubmit}>
                    <ul className={styles.header__container}>
                        <li className={styles.header__container_left}>
                        <span>
                            <a href="#">
                                <svg className={styles.header__icon} width="32" height="32">
                                        <use href="/images/icons.svg#icon-list2"></use>
                                </svg>
                            </a>
                        </span>
                            <a href="/">
                                <Image
                                    src="/images/logo.png"
                                    alt="Logo DailyFarm"
                                    width={100}
                                    height={70}
                                    // style={{ height: 'auto' }}
                                />
                            </a>
                        </li>
                        <li className={styles.header__container_centerSearchBox}>
                            {/*<div className={styles.header__container_searchBox}>*/}
                            <input type="search" placeholder="Search..."
                                   value={query}
                                   onChange={(e) => setQuery(e.target.value)}/>
                            <button type="submit" aria-label="Search">
                                <i className="fas fa-search"></i>
                            </button>
                            {/*</div>*/}
                        </li>
                        <li className={styles.header__container_right}>
                            <span style={{position: 'relative'}}>
                                    <Link href={"/cart"}>
                                    <div>
                                        <svg className={styles.header__icon} width="32" height="32">
                                            <use href="/images/icons.svg#icon-cart"></use>
                                        </svg>

                                        {arrayCart.length > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: -9,
                                                right: 2,
                                                background: 'red',
                                                color: 'white',
                                                borderRadius: '50%',
                                                padding: '2px 6px',
                                                fontSize: '12px'
                                            }}>
                                     {arrayCart.length}
                                    </span>
                                        )}
                                </div>
                                    </Link>
                            </span>

                            <span>
                                <Link href="/login">
                                            <svg className={styles.header__icon} width="32" height="32">
                                                        <use href="/images/icons.svg#icon-user"></use>
                                            </svg>
                                </Link>
                            </span>
                        </li>
                    </ul>
                </form>
            </nav>
        </div>
    );
};

export default HeaderSearch;