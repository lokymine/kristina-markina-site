"use client";

import styles from "./Sidebar.module.css";

type Props = {
    active: string;
};

export default function Sidebar({
    active,
}: Props) {

    return (

        <aside className={styles.sidebar}>

            <h2 className={styles.logo}>
                Gallery CMS
            </h2>

            <nav>

                <button
                    className={
                        active === "dashboard"
                            ? styles.active
                            : styles.link
                    }
                >
                    📊 Dashboard
                </button>

                <button
                    className={styles.link}
                >
                    🖼 Картины
                </button>

                <button
                    className={styles.link}
                >
                    ⚙ Настройки
                </button>

            </nav>

        </aside>

    );

}