import styles from '../styles/components/contacts.module.scss';

const Contacts = () => {
    return (
        <section className={styles.contacts} id="contact-section">
            <h2>How to find us</h2>
            <div><a className={styles.contacts__address} href="https://maps.app.goo.gl/5mmKpuX42DyRRA7Q8"
                   target="_blank">Rue de Chassart 4, 6221 Fleurus, Belgium</a></div>

            <div className={styles.contacts__mapWrapper}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d40582.569563588164!2d4.473744!3d50.5265327!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c22bd3505b62af%3A0x8c19dee7074863f6!2sRedebel%20sa-nv!5e0!3m2!1sru!2sil!4v1745338496336!5m2!1sru!2sil"
                    width="380"
                    height="380"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

        </section>
    );
};

export default Contacts;