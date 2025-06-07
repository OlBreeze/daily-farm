import Image from "next/image";
import Link from "next/link";
import styles from '../styles/components/footer.module.scss';

const Footer = () => {
    return (
    <footer className={styles.footer}>
        <div className="container">
            <div className={styles.footer__container}>
                <a href="/">
                    <Image src="/images/logo.png" alt="Logo DailyFarm" width={100}
                           height={70}/></a>
                <ul className={styles.footer__menu}>
                    <li><Link href="/" className={styles.footer__link}>Home</Link></li>
                    <li><Link href="/contact" className={styles.footer__link}>
                        Contact us</Link></li>
                    <li><Link href="/payment_delivery" className={styles.footer__link}>Payment and delivery</Link></li>
                </ul>
                <address className={styles.footer__address}>
                    <ul>
                        <li><a className={styles.footer__link} href="tel:+380960000007">+ 38 (096) 000 00 07</a></li>
                        <li><a className={styles.footer__link} href="mailto:dailyfarm@gmail.com">dailyfarm@gmail.com</a>
                        </li>
                        <li><a className={styles.footer__link} href="https://maps.app.goo.gl/5mmKpuX42DyRRA7Q8"
                                target="_blank">Rue de Chassart 4, 6221 Fleurus, Belgium</a></li>
                        <div className={styles.footer__social}>
                            <a href="#">
                                <svg className={styles.footer__socialIcon} width="32" height="32">
                                    <use href="/images/icons.svg#icon-facebook2"></use>
                                </svg>
                            </a>

                            <a href="#">
                                <svg className={styles.footer__socialIcon} width="32" height="32">
                                    <use href="/images/icons.svg#icon-instagram"></use>
                                </svg>
                            </a>
                        </div>
                    </ul>
                </address>
                <div className={styles.footer__privacy}>
                    <a className={styles.footer__link} href="#" target="_blank">Privacy Policy</a>
                    <p className={styles.footer__copyright}>&copy; 2025 Data protected</p>
                </div>
            </div>
        </div>
    </footer>)};

export default Footer;