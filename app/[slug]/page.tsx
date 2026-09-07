import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ArtworkViewTracker from "@/components/ArtworkViewTracker";

import styles from "./page.module.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArtworkPage({
  params,
}: Props) {
  const { slug } = await params;

  const artwork = await prisma.artwork.findUnique({
    where: {
      slug,
    },
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!artwork) {
    notFound();
  }

  const contacts = await prisma.contacts.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
    },
  });

  const formattedPrice =
    new Intl.NumberFormat("ru-RU").format(
      artwork.price
    ) + " ₽";

  const additionalImages = artwork.images;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link
          href="/#catalog"
          className={styles.back}
        >
          ← Вернуться к каталогу
        </Link>

        <ArtworkViewTracker
          artworkId={artwork.id}
        />

        <div className={styles.grid}>
          {/* =========================
              ИЗОБРАЖЕНИЯ
          ========================== */}

          <div className={styles.images}>
            <div
              className={
                styles.imageGalleryContainer
              }
            >
              {/* =========================
                  ГЛАВНОЕ ФОТО
              ========================== */}

              <div className={styles.mainImage}>
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  width={1200}
                  height={1200}
                  priority
                  sizes="
                    (max-width: 900px) 100vw,
                    55vw
                  "
                  className={
                    styles.mainImageImg
                  }
                />
              </div>

              {/* =========================
                  ДОПОЛНИТЕЛЬНЫЕ ФОТО
              ========================== */}

              {additionalImages.length > 0 && (
                <div className={styles.gallery}>
                  {additionalImages.length === 1 ? (
                    <div className={styles.galleryState}>
                      <div className={styles.gallerySlide}>
                        <div className={styles.galleryPhotos}>
                          <div className={styles.additionalImage}>
                            <img
                              src={additionalImages[0].image}
                              alt={`${artwork.title} — дополнительное фото 1`}
                            />
                          </div>
                        </div>

                        <div
                          className={`${styles.galleryArrow} ${styles.galleryArrowLeft} ${styles.galleryArrowDisabled}`}
                        >
                          <span>←</span>
                        </div>

                        <div
                          className={`${styles.galleryArrow} ${styles.galleryArrowRight} ${styles.galleryArrowDisabled}`}
                        >
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    Array.from({
                      length: additionalImages.length - 1,
                    }).map((_, index) => {
                      const firstImage =
                        additionalImages[index];

                      const secondImage =
                        additionalImages[index + 1];

                      const previousIndex = index - 1;
                      const nextIndex = index + 1;

                      const hasPrevious =
                        previousIndex >= 0;

                      const hasNext =
                        nextIndex <
                        additionalImages.length - 1;

                      return (
                        <div
                          key={index}
                          className={styles.galleryState}
                        >
                          <input
                            type="radio"
                            name={`gallery-${artwork.id}`}
                            id={`gallery-${artwork.id}-${index}`}
                            className={styles.galleryRadio}
                            defaultChecked={index === 0}
                          />

                          <div className={styles.gallerySlide}>
                            <div className={styles.galleryPhotos}>
                              <div className={styles.additionalImage}>
                                <img
                                  src={firstImage.image}
                                  alt={`${artwork.title} — дополнительное фото ${index + 1}`}
                                />
                              </div>

                              <div
                                className={`${styles.additionalImage} ${styles.secondAdditionalImage}`}
                              >
                                <img
                                  src={secondImage.image}
                                  alt={`${artwork.title} — дополнительное фото ${index + 2}`}
                                />
                              </div>
                            </div>

                            {hasPrevious ? (
                              <label
                                htmlFor={`gallery-${artwork.id}-${previousIndex}`}
                                className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                                aria-label="Предыдущие фотографии"
                              >
                                <span>←</span>
                              </label>
                            ) : (
                              <div
                                className={`${styles.galleryArrow} ${styles.galleryArrowLeft} ${styles.galleryArrowDisabled}`}
                              >
                                <span>←</span>
                              </div>
                            )}

                            {hasNext ? (
                              <label
                                htmlFor={`gallery-${artwork.id}-${nextIndex}`}
                                className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                                aria-label="Следующие фотографии"
                              >
                                <span>→</span>
                              </label>
                            ) : (
                              <div
                                className={`${styles.galleryArrow} ${styles.galleryArrowRight} ${styles.galleryArrowDisabled}`}
                              >
                                <span>→</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =========================
              ИНФОРМАЦИЯ
          ========================== */}

          <div className={styles.info}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                {artwork.title}
              </h1>

              <div className={styles.price}>
                {formattedPrice}
              </div>
            </div>

            {/* =========================
                МЕТА
            ========================== */}

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span>Год</span>

                <strong>
                  {artwork.year}
                </strong>
              </div>

              <div className={styles.metaItem}>
                <span>Размер</span>

                <strong>
                  {artwork.width} ×{" "}
                  {artwork.height} см
                </strong>
              </div>

              <div className={styles.metaItem}>
                <span>Материал</span>

                <strong>
                  {artwork.material}
                </strong>
              </div>

              <div className={styles.metaItem}>
                <span>Статус</span>

                <strong>
                  {artwork.status === "sold"
                    ? "Продано"
                    : "В наличии"}
                </strong>
              </div>
            </div>

            {/* =========================
                ОПИСАНИЕ
            ========================== */}

            {artwork.description && (
              <p
                className={
                  styles.description
                }
              >
                {artwork.description}
              </p>
            )}

            {/* =========================
                КОНТАКТЫ
            ========================== */}

            <div className={styles.contacts}>
              <div
                className={
                  styles.contactsTitle
                }
              >
                По вопросам приобретения
              </div>

              <p
                className={
                  styles.contactsText
                }
              >
                Чтобы узнать наличие работы и
                условия приобретения, свяжитесь
                со мной.
              </p>

              <div
                className={
                  styles.contactsCards
                }
              >
                {/* =========================
                    ТЕЛЕФОН
                ========================== */}

                {contacts.phone && (
                  <a
                    href={`tel:${contacts.phone.replace(
                      /[^+\d]/g,
                      ""
                    )}`}
                    className={
                      styles.contactCard
                    }
                  >
                    <div
                      className={
                        styles.contactIcon
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M6.6 3.5 9.2 3l2 4.7-2 1.6c.9 1.9 2.6 3.6 4.5 4.5l1.6-2 4.7 2-.5 2.6c-.2 1-1.1 1.7-2.1 1.6-7.8-.7-13.6-6.5-14.3-14.3-.1-1 .6-1.9 1.5-2.2Z" />
                      </svg>
                    </div>

                    <div
                      className={
                        styles.contactContent
                      }
                    >
                      <span
                        className={
                          styles.contactLabel
                        }
                      >
                        Телефон
                      </span>

                      <strong
                        className={
                          styles.contactValue
                        }
                      >
                        {contacts.phone}
                      </strong>
                    </div>
                  </a>
                )}

                {/* =========================
                    EMAIL
                ========================== */}

                {contacts.email && (
                  <a
                    href={`mailto:${contacts.email}`}
                    className={
                      styles.contactCard
                    }
                  >
                    <div
                      className={
                        styles.contactIcon
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />

                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    </div>

                    <div
                      className={
                        styles.contactContent
                      }
                    >
                      <span
                        className={
                          styles.contactLabel
                        }
                      >
                        Email
                      </span>

                      <strong
                        className={
                          styles.contactValue
                        }
                      >
                        {contacts.email}
                      </strong>
                    </div>
                  </a>
                )}

                {/* =========================
                    INSTAGRAM
                ========================== */}

                {contacts.instagram && (
                  <a
                    href={contacts.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      styles.contactCard
                    }
                  >
                    <div
                      className={
                        styles.contactIcon
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="4"
                        />

                        <circle
                          cx="17.5"
                          cy="6.5"
                          r="1"
                          className={
                            styles.instagramDot
                          }
                        />
                      </svg>
                    </div>

                    <div
                      className={
                        styles.contactContent
                      }
                    >
                      <span
                        className={
                          styles.contactLabel
                        }
                      >
                        Социальная сеть
                      </span>

                      <strong
                        className={
                          styles.contactValue
                        }
                      >
                        Instagram
                      </strong>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}