"use client";

import styles from "./ArtworkDashboard.module.css";

type Artwork = {
  id: number;
  title: string;
  price: number;
  status: string;
  createdAt?: string;
};

type Props = {
  artworks: Artwork[];
};

export default function ArtworkDashboard({
  artworks,
}: Props) {
  const totalArtworks = artworks.length;

  const availableArtworks = artworks.filter(
    (artwork) => artwork.status === "available"
  ).length;

  const soldArtworks = artworks.filter(
    (artwork) => artwork.status === "sold"
  ).length;

  const totalValue = artworks.reduce(
    (sum, artwork) => sum + artwork.price,
    0
  );

  const averagePrice =
    totalArtworks > 0
      ? Math.round(totalValue / totalArtworks)
      : 0;

  const latestArtworks = [...artworks]
    .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) {
        return 0;
        }

        return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
        );
    })
    .slice(0, 5);

  function formatPrice(price: number) {
    return (
      new Intl.NumberFormat("ru-RU").format(price) +
      " ₽"
    );
  }

  return (
    <section className={styles.dashboard}>
      <div className={styles.cards}>
        <article className={styles.card}>
          <span className={styles.label}>
            Всего картин
          </span>

          <strong>{totalArtworks}</strong>
        </article>

        <article className={styles.card}>
          <span className={styles.label}>
            В наличии
          </span>

          <strong>{availableArtworks}</strong>
        </article>

        <article className={styles.card}>
          <span className={styles.label}>
            Продано
          </span>

          <strong>{soldArtworks}</strong>
        </article>

        <article className={styles.card}>
          <span className={styles.label}>
            Стоимость каталога
          </span>

          <strong>
            {formatPrice(totalValue)}
          </strong>
        </article>

        <article className={styles.card}>
          <span className={styles.label}>
            Средняя цена
          </span>

          <strong>
            {formatPrice(averagePrice)}
          </strong>
        </article>
      </div>

      <div className={styles.activity}>
        <div className={styles.activityHeader}>
          <div>
            <h2>
              Последние добавленные картины
            </h2>

            <p>
              Недавно добавленные работы в каталог
            </p>
          </div>
        </div>

        <div className={styles.activityList}>
          {latestArtworks.length === 0 ? (
            <div className={styles.empty}>
              Пока нет картин
            </div>
          ) : (
            latestArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className={styles.activityItem}
              >
                <div className={styles.activityInfo}>
                  <strong>
                    {artwork.title}
                  </strong>

                  <span>
                    {artwork.status === "sold"
                      ? "Продано"
                      : "В наличии"}
                  </span>
                </div>

                <strong
                  className={styles.activityPrice}
                >
                  {formatPrice(artwork.price)}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}