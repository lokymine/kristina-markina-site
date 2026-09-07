import Image from "next/image";
import Link from "next/link";

import { getFontFamily } from "@/lib/fonts";

import {
  Phone,
  Mail,
  Send,
  MessageCircle,
  Globe,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import Artworkcatalog from "@/components/Artworkcatalog";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function InstagramIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="4.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="17.4"
        cy="6.7"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

export default async function Home() {
  /*
   * =========================
   * НАСТРОЙКИ САЙТА
   * =========================
   */

  let settings =
    await prisma.siteSettings.findUnique({
      where: {
        id: 1,
      },
    });

  if (!settings) {
    settings =
      await prisma.siteSettings.create({
        data: {
          id: 1,
        },
      });
  }

  /*
   * =========================
   * КОНТАКТЫ
   * =========================
   */

  const contacts =
    await prisma.contacts.upsert({
      where: {
        id: 1,
      },

      update: {},

      create: {
        id: 1,
        phone: "",
        email: "",
        telegram: "",
        vk: "",
        whatsapp: "",
        instagram: "",
      },
    });

  /*
   * =========================
   * ИЗОБРАЖЕНИЯ
   * =========================
   */

  const hasHeroImage =
    Boolean(settings.heroImage);

  const hasBackgroundImage =
    Boolean(settings.backgroundImage);

  /*
   * Если фотография справа существует,
   * текст автоматически остаётся слева.
   */

  const homeLayout =
    hasHeroImage
      ? "left"
      : settings.homeLayout;

  /*
   * =========================
   * ЦВЕТА
   * =========================
   *
   * Здесь используются именно
   * новые отдельные настройки.
   */

  const labelColor =
    settings.homeLabelColor ||
    "#f8f7f3";

  const titleColor =
    settings.homeTitleColor ||
    "#f8f7f3";

  const descriptionColor =
    settings.homeDescriptionColor ||
    "#f8f7f3";

  const buttonColor =
    settings.homeButtonColor ||
    "#292722";

  const buttonTextColor =
    settings.homeButtonTextColor ||
    "#f8f7f3";

  const backgroundColor =
    settings.backgroundColor ||
    "#f8f7f3";

  /*
   * =========================
   * ЗАТЕМНЕНИЕ ФОНА
   * =========================
   */

  const overlay =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          settings.backgroundOverlay ?? 0
        )
      )
    ) / 100;

  /*
   * =========================
   * ФОН
   * =========================
   */

  const backgroundImage =
    hasBackgroundImage
      ? `linear-gradient(
          rgba(0, 0, 0, ${overlay}),
          rgba(0, 0, 0, ${overlay})
        ),
        url("${settings.backgroundImage}")`
      : "none";

  return (
    <main
      className={styles.page}
      style={{
        backgroundColor,
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* =====================================================
          ГЛАВНЫЙ ЭКРАН
      ===================================================== */}

      <section
        className={`${styles.hero} ${
          homeLayout === "center"
            ? styles.heroCenter
            : ""
        }`}
      >
        {/* =================================================
            ТЕКСТ
        ================================================= */}

        <div
          className={`${styles.heroContent} ${
            homeLayout === "center"
              ? styles.heroContentCenter
              : ""
          }`}
          style={{
            fontFamily: getFontFamily(
              settings.homeFontFamily
            ),
          }}
        >
          {/* МАЛЕНЬКАЯ НАДПИСЬ */}

          <p
            className={styles.heroLabel}
            style={{
              color: labelColor,
            }}
          >
            {settings.homeLabel}
          </p>

          {/* ЗАГОЛОВОК */}

          <h1
            className={styles.heroTitle}
            style={{
              color: titleColor,
            }}
          >
            {settings.homeTitle}
          </h1>

          {/* ОПИСАНИЕ */}

          <p
            className={styles.heroDescription}
            style={{
              color: descriptionColor,
            }}
          >
            {settings.homeDescription}
          </p>

          {/* КНОПКА */}

          <Link
            href="/#catalog"
            className={styles.heroButton}
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor,
            }}
          >
            {settings.homeButtonText}
          </Link>
        </div>

        {/* =================================================
            ФОТО ХУДОЖНИКА
        ================================================= */}

        {hasHeroImage && (
          <div
            className={styles.heroImageWrapper}
          >
            <Image
              src={settings.heroImage!}
              alt="Работа Кристины Маркиной"
              fill
              priority
              sizes="
                (max-width: 768px) 80vw,
                (max-width: 1200px) 360px,
                420px
              "
              className={styles.heroImage}
            />
          </div>
        )}
      </section>

      {/* =====================================================
          КАТАЛОГ
      ===================================================== */}
      
        <Artworkcatalog />

      {/* =====================================================
          КОНТАКТЫ
      ===================================================== */}

      <section
        id="contacts"
        className={styles.contacts}
        style={{
          fontFamily: getFontFamily(
            contacts.fontFamily
          ),
        }}
      >
        <div
          className={styles.contactsInner}
        >
          {/* ЗАГОЛОВОК КОНТАКТОВ */}

          <div
            className={styles.contactsHeading}
          >
            <p
              className={styles.contactsLabel}
            >
              Контакты
            </p>

            <h2
              className={styles.contactsTitle}
            >
              Связаться со мной
            </h2>
          </div>

          {/* КОНТАКТЫ */}

          <div
            className={styles.contactsGrid}
          >
            {/* ==========================================
                ТЕЛЕФОН
            ========================================== */}

            {contacts.phone && (
              <a
                href={`tel:${contacts.phone}`}
                className={styles.contact}
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Phone size={21} />
                </span>

                <span
                  className={
                    styles.contactContent
                  }
                >
                  <small>
                    Телефон
                  </small>

                  <strong>
                    {contacts.phone}
                  </strong>
                </span>
              </a>
            )}

            {/* ==========================================
                EMAIL
            ========================================== */}

            {contacts.email && (
              <a
                href={`mailto:${contacts.email}`}
                className={styles.contact}
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Mail size={21} />
                </span>

                <span
                  className={
                    styles.contactContent
                  }
                >
                  <small>
                    Email
                  </small>

                  <strong>
                    {contacts.email}
                  </strong>
                </span>
              </a>
            )}

            {/* ==========================================
                TELEGRAM
            ========================================== */}

            {contacts.telegram && (
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contact}
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Send size={20} />
                </span>

                <span
                  className={
                    styles.contactContent
                  }
                >
                  <small>
                    Telegram
                  </small>

                  <strong>
                    Telegram
                  </strong>
                </span>
              </a>
            )}

            {/* ==========================================
                VK
            ========================================== */}

            {contacts.vk && (
              <a
                href={contacts.vk}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contact}
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Globe size={21} />
                </span>

                <span
                  className={
                    styles.contactContent
                  }
                >
                  <small>
                    Социальная сеть
                  </small>

                  <strong>
                    VK
                  </strong>
                </span>
              </a>
            )}

            {/* ==========================================
                WHATSAPP
            ========================================== */}

            {contacts.whatsapp && (
              <a
                href={contacts.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contact}
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <MessageCircle
                    size={21}
                  />
                </span>

                <span
                  className={
                    styles.contactContent
                  }
                >
                  <small>
                    Мессенджер
                  </small>

                  <strong>
                    WhatsApp
                  </strong>
                </span>
              </a>
            )}

            {/* ==========================================
                INSTAGRAM
            ========================================== */}

            {contacts.instagram && (
              <a
                href={contacts.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contact}
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <InstagramIcon />
                </span>

                <span
                  className={
                    styles.contactContent
                  }
                >
                  <small>
                    Социальная сеть
                  </small>

                  <strong>
                    Instagram
                  </strong>
                </span>
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}