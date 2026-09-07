import styles from "./ContactsPage.module.css";

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <p className={styles.label}>
          Контакты
        </p>

        <h1 className={styles.title}>
          Свяжитесь с нами
        </h1>

        <div className={styles.contacts}>
          <a
            href="tel:+79999999999"
            className={styles.contact}
          >
            +7 (999) 999-99-99
          </a>

          <a
            href="mailto:info@example.ru"
            className={styles.contact}
          >
            info@example.ru
          </a>

          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contact}
          >
            Telegram
          </a>
        </div>
      </section>
    </main>
  );
}