"use client";

import styles from "./Header.module.css";

type Props = {
  onLogout: () => void;
};

export default function Header({
  onLogout,
}: Props) {
  return (
    <header className={styles.header}>
      <div>
        <h1>Админ-панель</h1>

        <p>
          Управление галереей
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            A
          </div>

          <div>
            <strong>Администратор</strong>

            <span>Онлайн</span>
          </div>
        </div>

        <button
          className={styles.logout}
          onClick={onLogout}
        >
          Выйти
        </button>
      </div>
    </header>
  );
}