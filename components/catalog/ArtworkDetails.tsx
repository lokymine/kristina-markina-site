"use client";

import { useRouter } from "next/navigation";

import styles from "./ArtworkDetails.module.css";

type ArtworkImage = {
  id: number;
  artworkId: number;
  image: string;
  order: number;
  createdAt: string;
};

type Artwork = {
  id: number;
  title: string;
  slug: string;

  image: string;

  year: number;
  material: string;

  size: string;
  width: number;
  height: number;

  price: number;

  description: string;

  category: string;
  status: string;

  images?: ArtworkImage[];
};

type Props = {
  artwork: Artwork;
};

export default function ArtworkDetails({
  artwork,
}: Props) {
  const router = useRouter();

  const additionalImages = [...(artwork.images ?? [])].sort(
    (a, b) => a.order - b.order
  );

  const formattedPrice =
    new Intl.NumberFormat("ru-RU").format(artwork.price) +
    " ₽";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Назад */}
        <button
          type="button"
          className={styles.back}
          onClick={() => router.back()}
        >
          <span>←</span>
          Назад
        </button>

        <section className={styles.content}>
          {/* =========================================
              ЛЕВАЯ КОЛОНКА — ФОТОГРАФИИ
          ========================================= */}

          <div className={styles.imagesColumn}>
            {/* Главное изображение */}
            <div
              className={styles.imageWrapper}
              style={{
                aspectRatio: `${artwork.width} / ${artwork.height}`,
              }}
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                className={styles.image}
              />
            </div>

            {/* Дополнительные фотографии */}
            {additionalImages.length > 0 && (
              <div className={styles.additionalImages}>
                {additionalImages.map((item) => (
                  <div
                    key={item.id}
                    className={styles.additionalImageWrapper}
                  >
                    <img
                      src={item.image}
                      alt={`${artwork.title} — дополнительное фото`}
                      className={styles.additionalImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =========================================
              ПРАВАЯ КОЛОНКА — ИНФОРМАЦИЯ
          ========================================= */}

          <div className={styles.info}>
            {/* Категория */}
            <div className={styles.category}>
              {artwork.category}
            </div>

            {/* Название */}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                {artwork.title}
              </h1>

              <div className={styles.price}>
                {formattedPrice}
              </div>
            </div>

            {/* Характеристики */}
            <div className={styles.details}>
              <div className={styles.detail}>
                <span>Год</span>
                <strong>{artwork.year}</strong>
              </div>

              <div className={styles.detail}>
                <span>Размер</span>
                <strong>
                  {artwork.size ||
                    `${artwork.width} × ${artwork.height} см`}
                </strong>
              </div>

              <div className={styles.detail}>
                <span>Материал</span>
                <strong>{artwork.material}</strong>
              </div>

              <div className={styles.detail}>
                <span>Статус</span>
                <strong>
                  {artwork.status === "sold"
                    ? "Продано"
                    : "В наличии"}
                </strong>
              </div>
            </div>

            {/* Описание */}
            <div className={styles.description}>
              {artwork.description}
            </div>

            {/* =========================================
                БЛОК ПОКУПКИ
            ========================================= */}

            <div className={styles.contactBox}>
              <div className={styles.contactHeader}>
                <div className={styles.contactTitle}>
                  По вопросам приобретения
                </div>

                <div className={styles.contactLine} />
              </div>

              <p className={styles.contactText}>
                Чтобы узнать наличие работы и условия
                приобретения, свяжитесь со мной.
              </p>

              <div className={styles.contactLinks}>
                <a href="tel:+79999999999">
                  Позвонить
                </a>

                <a href="mailto:info@example.ru">
                  Написать на почту
                </a>

                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}