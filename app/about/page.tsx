"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./page.module.css";

import {
  Phone,
  Mail,
  Send,
  MessageCircle,
  Globe,
} from "lucide-react";

import { getFontFamily } from "@/lib/fonts";

type AboutData = {
  title: string;
  description: string;
  image: string | null;

  titleColor: string;
  descriptionColor: string;

  fontFamily: string;
};

type ContactsData = {
  phone: string | null;
  email: string | null;
  telegram: string | null;
  vk: string | null;
  whatsapp: string | null;
  instagram: string | null;

  fontFamily: string;
};

type SiteData = {
  backgroundColor: string;
  backgroundImage: string | null;
  backgroundOverlay: number;
};

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

export default function AboutPage() {
  const [about, setAbout] =
    useState<AboutData | null>(null);

  const [contacts, setContacts] =
    useState<ContactsData | null>(null);

  const [site, setSite] =
    useState<SiteData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          aboutResponse,
          contactsResponse,
          settingsResponse,
        ] = await Promise.all([
          fetch("/api/about", {
            cache: "no-store",
          }),

          fetch("/api/contacts", {
            cache: "no-store",
          }),

          fetch("/api/home-settings", {
            cache: "no-store",
          }),
        ]);

        if (
          !aboutResponse.ok ||
          !contactsResponse.ok ||
          !settingsResponse.ok
        ) {
          throw new Error(
            "Ошибка загрузки данных"
          );
        }

        const aboutData =
          await aboutResponse.json();

        const contactsData =
          await contactsResponse.json();

        const settingsData =
          await settingsResponse.json();

        setAbout({
          title:
            aboutData.title ?? "",

          description:
            aboutData.description ?? "",

          image:
            aboutData.image ?? null,

          titleColor:
            aboutData.titleColor ??
            "#292722",

          descriptionColor:
            aboutData.descriptionColor ??
            "#5f5b54",

          fontFamily:
            aboutData.fontFamily ??
            "Inter",
        });

        setContacts({
          phone:
            contactsData.phone ?? "",

          email:
            contactsData.email ?? "",

          telegram:
            contactsData.telegram ?? "",

          vk:
            contactsData.vk ?? "",

          whatsapp:
            contactsData.whatsapp ?? "",

          instagram:
            contactsData.instagram ?? "",

          fontFamily:
            contactsData.fontFamily ??
            "Inter",
        });

        setSite({
          backgroundColor:
            settingsData.backgroundColor ??
            "#f8f7f3",

          backgroundImage:
            settingsData.backgroundImage ??
            null,

          backgroundOverlay:
            Number(
              settingsData.backgroundOverlay ??
                0
            ),
        });
      } catch (error) {
        console.error(
          "ABOUT PAGE ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      window.location.hash ===
        "#about-contacts"
    ) {
      setTimeout(() => {
        document
          .getElementById(
            "about-contacts"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    }
  }, [loading]);

  if (loading) {
    return (
      <main className={styles.loading}>
        Загрузка...
      </main>
    );
  }

  if (!about) {
    return (
      <main className={styles.loading}>
        Не удалось загрузить информацию.
      </main>
    );
  }

  const overlay = Math.min(
    100,
    Math.max(
      0,
      Number(
        site?.backgroundOverlay ?? 0
      )
    )
  );

  const backgroundStyle = {
    backgroundColor:
      site?.backgroundColor ??
      "#f8f7f3",

    backgroundImage:
      site?.backgroundImage
        ? `linear-gradient(rgba(0,0,0,${
            overlay / 100
          }), rgba(0,0,0,${
            overlay / 100
          })), url("${site.backgroundImage}")`
        : "none",

    backgroundSize: "cover",

    backgroundPosition:
      "center",

    backgroundAttachment:
      "fixed",
  };

  return (
    <main
      className={styles.page}
      style={{
        ...backgroundStyle,

        fontFamily: getFontFamily(
          about.fontFamily
        ),
      }}
    >
      {/* =================================
          О ХУДОЖНИКЕ
      ================================= */}

      <section
        className={styles.about}
      >
        <div
          className={styles.content}
        >
          <p
            className={styles.label}
          >
            Художник
          </p>

          <h1
            className={styles.title}
            style={{
              color:
                about.titleColor,
            }}
          >
            {about.title}
          </h1>

          <div
            className={styles.description}
            style={{
              color: about.descriptionColor,
            }}
          >
            {about.description
              .split(/\r?\n/)
              .map((paragraph, index) => {
                if (!paragraph.trim()) {
                  return null;
                }

                return (
                  <p key={index}>
                    {paragraph}
                  </p>
                );
              })}
          </div>
        </div>

        {about.image && (
          <div
            className={
              styles.imageWrapper
            }
          >
            <Image
              src={about.image}
              alt={
                about.title ||
                "О художнике"
              }
              fill
              priority
              sizes="
                (max-width: 768px) 100vw,
                50vw
              "
              className={
                styles.image
              }
            />
          </div>
        )}
      </section>

      {/* =================================
          КОНТАКТЫ
      ================================= */}

      <section
        id="about-contacts"
        className={
          styles.contacts
        }
        style={{
          fontFamily: getFontFamily(
            contacts?.fontFamily
          ),
        }}
      >
        <div
          className={
            styles.contactsInner
          }
        >
          {/* Заголовок контактов */}

          <div
            className={
              styles.contactsHeading
            }
          >
            <p
              className={
                styles.contactsLabel
              }
            >
              Контакты
            </p>

            <h2
              className={
                styles.contactsTitle
              }
            >
              Связаться со мной
            </h2>
          </div>

          {/* Сетка контактов */}

          <div
            className={
              styles.contactsGrid
            }
          >
            {/* Телефон */}

            {contacts?.phone && (
              <a
                href={`tel:${contacts.phone}`}
                className={
                  styles.contact
                }
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Phone
                    size={21}
                    strokeWidth={1.8}
                  />
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

            {/* Email */}

            {contacts?.email && (
              <a
                href={`mailto:${contacts.email}`}
                className={
                  styles.contact
                }
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Mail
                    size={21}
                    strokeWidth={1.8}
                  />
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

            {/* Telegram */}

            {contacts?.telegram && (
              <a
                href={
                  contacts.telegram
                }
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.contact
                }
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Send
                    size={20}
                    strokeWidth={1.8}
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
                    Telegram
                  </strong>
                </span>
              </a>
            )}

            {/* VK */}

            {contacts?.vk && (
              <a
                href={contacts.vk}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.contact
                }
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <Globe
                    size={21}
                    strokeWidth={1.8}
                  />
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

            {/* WhatsApp */}

            {contacts?.whatsapp && (
              <a
                href={
                  contacts.whatsapp
                }
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.contact
                }
              >
                <span
                  className={
                    styles.contactIcon
                  }
                >
                  <MessageCircle
                    size={21}
                    strokeWidth={1.8}
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

            {/* Instagram */}

            {contacts?.instagram && (
              <a
                href={
                  contacts.instagram
                }
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.contact
                }
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