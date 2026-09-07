"use client";

import { useEffect, useState } from "react";

import styles from "./Dashboard.module.css";

type ArtworkStat = {
  id: number;
  title: string;
  image: string;
  views: number;
  clicks: number;
};

type DailyStat = {
  date: string;
  visits: number;
  uniqueVisits: number;
};

type StatsResponse = {
  success: boolean;

  totals: {
    visits: number;
    uniqueVisits: number;
    views: number;
    clicks: number;
  };

  popularArtwork: ArtworkStat | null;

  artworks: ArtworkStat[];

  daily: DailyStat[];
};

export default function Dashboard() {
  const [stats, setStats] =
    useState<StatsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadStats() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/stats",
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Не удалось загрузить статистику"
        );
      }

      const data =
        (await response.json()) as StatsResponse;

      if (!data.success) {
        throw new Error(
          "Статистика недоступна"
        );
      }

      setStats(data);
    } catch (error) {
      console.error(
        "Ошибка загрузки статистики:",
        error
      );

      setError(
        "Не удалось загрузить статистику"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();

    const interval =
      window.setInterval(() => {
        loadStats();
      }, 30000);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  function formatNumber(
    value: number
  ) {
    return new Intl.NumberFormat(
      "ru-RU"
    ).format(value);
  }

  function formatDate(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "ru-RU",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    ).format(new Date(date));
  }

  if (loading && !stats) {
    return (
      <div
        className={styles.loading}
      >
        Загрузка статистики...
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div
        className={styles.error}
      >
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      {/* =========================
          ОСНОВНЫЕ ПОКАЗАТЕЛИ
      ========================= */}

      <div className={styles.cards}>
        <div className={styles.card}>
          <span>
            Посещения
          </span>

          <strong>
            {formatNumber(
              stats.totals.visits
            )}
          </strong>

          <small>
            Всего заходов на сайт
          </small>
        </div>

        <div className={styles.card}>
          <span>
            Уникальные посещения
          </span>

          <strong>
            {formatNumber(
              stats.totals
                .uniqueVisits
            )}
          </strong>

          <small>
            Уникальные посетители
          </small>
        </div>

        <div className={styles.card}>
          <span>
            Просмотры картин
          </span>

          <strong>
            {formatNumber(
              stats.totals.views
            )}
          </strong>

          <small>
            Открытия страниц картин
          </small>
        </div>

        <div className={styles.card}>
          <span>
            Клики
          </span>

          <strong>
            {formatNumber(
              stats.totals.clicks
            )}
          </strong>

          <small>
            Переходы по картинам
          </small>
        </div>
      </div>

      {/* =========================
          САМАЯ ПОПУЛЯРНАЯ КАРТИНА
      ========================= */}

      {stats.popularArtwork && (
        <section
          className={
            styles.popular
          }
        >
          <div>
            <span
              className={
                styles.sectionLabel
              }
            >
              Самая просматриваемая
            </span>

            <h2>
              {
                stats
                  .popularArtwork
                  .title
              }
            </h2>

            <div
              className={
                styles.popularNumbers
              }
            >
              <div>
                <strong>
                  {
                    stats
                      .popularArtwork
                      .views
                  }
                </strong>

                <span>
                  просмотров
                </span>
              </div>

              <div>
                <strong>
                  {
                    stats
                      .popularArtwork
                      .clicks
                  }
                </strong>

                <span>
                  кликов
                </span>
              </div>
            </div>
          </div>

          <img
            src={
              stats
                .popularArtwork
                .image
            }
            alt={
              stats
                .popularArtwork
                .title
            }
          />
        </section>
      )}

      {/* =========================
          СТАТИСТИКА КАРТИН
      ========================= */}

      <section
        className={
          styles.section
        }
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <div>
            <span
              className={
                styles.sectionLabel
              }
            >
              Аналитика
            </span>

            <h2>
              Картины
            </h2>
          </div>

          <span
            className={
              styles.updated
            }
          >
            Обновляется автоматически
          </span>
        </div>

        {stats.artworks.length ===
        0 ? (
          <div
            className={
              styles.empty
            }
          >
            Пока нет данных
          </div>
        ) : (
          <div
            className={
              styles.tableWrapper
            }
          >
            <table
              className={
                styles.table
              }
            >
              <thead>
                <tr>
                  <th>
                    Картина
                  </th>

                  <th>
                    Просмотры
                  </th>

                  <th>
                    Клики
                  </th>
                </tr>
              </thead>

              <tbody>
                {stats.artworks.map(
                  (artwork) => (
                    <tr
                      key={
                        artwork.id
                      }
                    >
                      <td>
                        <div
                          className={
                            styles.artwork
                          }
                        >
                          <img
                            src={
                              artwork.image
                            }
                            alt={
                              artwork.title
                            }
                          />

                          <strong>
                            {
                              artwork.title
                            }
                          </strong>
                        </div>
                      </td>

                      <td>
                        {
                          artwork.views
                        }
                      </td>

                      <td>
                        {
                          artwork.clicks
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================
          ПОСЕЩЕНИЯ ПО ДНЯМ
      ========================= */}

      <section
        className={
          styles.section
        }
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <div>
            <span
              className={
                styles.sectionLabel
              }
            >
              Посещаемость
            </span>

            <h2>
              По дням
            </h2>
          </div>
        </div>

        {stats.daily.length ===
        0 ? (
          <div
            className={
              styles.empty
            }
          >
            Пока нет посещений
          </div>
        ) : (
          <div
            className={
              styles.daily
            }
          >
            {stats.daily
              .slice(0, 14)
              .map((item) => (
                <div
                  key={
                    item.date
                  }
                  className={
                    styles.dailyItem
                  }
                >
                  <div>
                    <strong>
                      {
                        formatDate(
                          item.date
                        )
                      }
                    </strong>

                    <span>
                      {item.uniqueVisits}{" "}
                      уникальных
                    </span>
                  </div>

                  <strong
                    className={
                      styles.dailyVisits
                    }
                  >
                    {item.visits}
                  </strong>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}