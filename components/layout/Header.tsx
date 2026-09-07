"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  function closeMenu() {
    setMenuOpen(false);
  }

  function scrollToSection(
    id: string
  ) {
    const element =
      document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleCatalogClick() {
    closeMenu();

    if (pathname === "/") {
      scrollToSection("catalog");
      return;
    }

    router.push("/#catalog");
  }

  function handleContactsClick() {
    const isAbout =
      window.location.pathname === "/about";

    const targetId = isAbout
      ? "about-contacts"
      : "contacts";

    if (
      window.location.pathname !== "/" &&
      !isAbout
    ) {
      window.location.href =
        `/#${targetId}`;

      return;
    }

    const contacts =
      document.getElementById(targetId);

    if (!contacts) return;

    contacts.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    closeMenu();
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="site-logo"
          onClick={closeMenu}
        >
          КРИСТИНА МАРКИНА
        </Link>

        <nav className="desktop-navigation">
          <button
            type="button"
            onClick={handleCatalogClick}
          >
            Каталог
          </button>

          <Link href="/about">
            О художнике
          </Link>

          <button
            type="button"
            onClick={handleContactsClick}
          >
            Контакты
          </button>
        </nav>

        <button
          type="button"
          className={`burger-button ${
            menuOpen ? "is-open" : ""
          }`}
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`mobile-navigation ${
          menuOpen ? "is-open" : ""
        }`}
      >
        <button
          type="button"
          onClick={handleCatalogClick}
        >
          Картины
        </button>

        <Link
          href="/about"
          onClick={closeMenu}
        >
          О художнике
        </Link>

        <button
          type="button"
          onClick={handleContactsClick}
        >
          Контакты
        </button>
      </div>
    </header>
  );
}