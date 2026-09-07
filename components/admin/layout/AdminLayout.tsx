"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./AdminLayout.module.css";

type Props = {
  children: React.ReactNode;
  onLogout: () => void;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "▦",
  },
  {
    label: "Картины",
    href: "/admin/artworks",
    icon: "▣",
  },
  {
    label: "Настройки",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function AdminLayout({
  children,
  onLogout,
}: Props) {
  const pathname = usePathname();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>G</span>

          <div>
            <strong>Gallery CMS</strong>
            <span>Админ-панель</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  isActive ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <button
            type="button"
            className={styles.logout}
            onClick={onLogout}
          >
            <span className={styles.icon}>↪</span>
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}