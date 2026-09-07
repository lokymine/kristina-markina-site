"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import Image from "next/image";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

/*
 * =========================================
 * ТИПЫ
 * =========================================
 */

type Artwork = {
  id: number;

  slug: string;

  title: string;

  image: string;

  year: number;

  price: number;

  width: number;

  height: number;

  material: string;

  size: string;

  description: string;

  category: string;

  status: string;
};

type Pagination = {
  page: number;

  pageSize: number;

  total: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
};

type SortOption =
  | "newest"
  | "oldest"
  | "priceAsc"
  | "priceDesc";

type ArtworksResponse = {
  artworks?: Artwork[];

  pagination?: Pagination;
};

/*
 * =========================================
 * КАТАЛОГ
 * =========================================
 */

export default function Artworkcatalog() {
  const router = useRouter();

  /*
   * =========================================
   * КАРТИНЫ
   * =========================================
   */

  const [artworks, setArtworks] =
    useState<Artwork[]>([]);

  /*
   * =========================================
   * ПАГИНАЦИЯ
   * =========================================
   */

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  /*
   * =========================================
   * СОСТОЯНИЯ
   * =========================================
   */

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * =========================================
   * СТРАНИЦА
   * =========================================
   */

  const [page, setPage] =
    useState(1);

  /*
   * =========================================
   * СОРТИРОВКА
   * =========================================
   */

  const [sort, setSort] =
    useState<SortOption>("newest");

  /*
   * =========================================
   * ВВЕДЁННЫЕ ФИЛЬТРЫ
   * =========================================
   *
   * Эти значения меняются во время ввода.
   *
   * Они НЕ вызывают загрузку каталога.
   */

  const [minWidth, setMinWidth] =
    useState("");

  const [maxWidth, setMaxWidth] =
    useState("");

  const [minHeight, setMinHeight] =
    useState("");

  const [maxHeight, setMaxHeight] =
    useState("");

  /*
   * =========================================
   * ПРИМЕНЁННЫЕ ФИЛЬТРЫ
   * =========================================
   *
   * Именно эти значения отправляются
   * на сервер.
   *
   * Они меняются только после кнопки
   * "Применить".
   */

  const [appliedMinWidth, setAppliedMinWidth] =
    useState("");

  const [appliedMaxWidth, setAppliedMaxWidth] =
    useState("");

  const [appliedMinHeight, setAppliedMinHeight] =
    useState("");

  const [appliedMaxHeight, setAppliedMaxHeight] =
    useState("");

  /*
   * =========================================
   * ЗАГРУЗКА КАРТИН
   * =========================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadArtworks() {
      try {
        setLoading(true);

        setError("");

        const params =
          new URLSearchParams();

        /*
         * =====================================
         * СТРАНИЦА
         * =====================================
         */

        params.set(
          "page",
          String(page)
        );

        /*
         * =====================================
         * СОРТИРОВКА
         * =====================================
         */

        params.set(
          "sort",
          sort
        );

        /*
         * =====================================
         * ШИРИНА
         * =====================================
         */

        if (
          appliedMinWidth.trim()
        ) {
          params.set(
            "minWidth",
            appliedMinWidth.trim()
          );
        }

        if (
          appliedMaxWidth.trim()
        ) {
          params.set(
            "maxWidth",
            appliedMaxWidth.trim()
          );
        }

        /*
         * =====================================
         * ВЫСОТА
         * =====================================
         */

        if (
          appliedMinHeight.trim()
        ) {
          params.set(
            "minHeight",
            appliedMinHeight.trim()
          );
        }

        if (
          appliedMaxHeight.trim()
        ) {
          params.set(
            "maxHeight",
            appliedMaxHeight.trim()
          );
        }

        /*
         * =====================================
         * ЗАПРОС
         * =====================================
         */

        const response =
          await fetch(
            `/api/artworks?${params.toString()}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data =
          (await response.json()) as
            ArtworksResponse;

        if (cancelled) {
          return;
        }

        /*
         * =====================================
         * КАРТИНЫ
         * =====================================
         */

        const loadedArtworks =
          Array.isArray(
            data.artworks
          )
            ? data.artworks
            : [];

        setArtworks(
          loadedArtworks
        );

        /*
         * =====================================
         * ПАГИНАЦИЯ
         * =====================================
         */

        setPagination(
          data.pagination ??
            null
        );
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Ошибка загрузки каталога:",
          loadError
        );

        setArtworks([]);

        setPagination(null);

        setError(
          "Не удалось загрузить картины"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadArtworks();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    sort,
    appliedMinWidth,
    appliedMaxWidth,
    appliedMinHeight,
    appliedMaxHeight,
  ]);

  /*
   * =========================================
   * СОРТИРОВКА
   * =========================================
   */

  const filteredArtworks =
    useMemo(() => {
      if (
        !Array.isArray(
          artworks
        )
      ) {
        return [];
      }

      return [
        ...artworks,
      ].sort((a, b) => {
        switch (sort) {
          case "priceAsc":
            return (
              a.price -
              b.price
            );

          case "priceDesc":
            return (
              b.price -
              a.price
            );

          case "oldest":
            return (
              a.year -
              b.year
            );

          case "newest":
          default:
            return (
              b.year -
              a.year
            );
        }
      });
    }, [
      artworks,
      sort,
    ]);

  /*
   * =========================================
   * ПРИМЕНИТЬ ФИЛЬТРЫ
   * =========================================
   */

  function applyFilters() {
    setAppliedMinWidth(
      minWidth.trim()
    );

    setAppliedMaxWidth(
      maxWidth.trim()
    );

    setAppliedMinHeight(
      minHeight.trim()
    );

    setAppliedMaxHeight(
      maxHeight.trim()
    );

    setPage(1);
  }

  /*
   * =========================================
   * СБРОС ФИЛЬТРОВ
   * =========================================
   */

  function resetFilters() {
    setSort("newest");

    /*
     * Очищаем поля ввода
     */

    setMinWidth("");

    setMaxWidth("");

    setMinHeight("");

    setMaxHeight("");

    /*
     * Очищаем применённые фильтры
     */

    setAppliedMinWidth("");

    setAppliedMaxWidth("");

    setAppliedMinHeight("");

    setAppliedMaxHeight("");

    setPage(1);
  }

  /*
   * =========================================
   * СОРТИРОВКА
   * =========================================
   */

  function handleSortChange(
    value: SortOption
  ) {
    setSort(value);

    setPage(1);
  }

  /*
   * =========================================
   * ФИЛЬТР ШИРИНЫ
   * =========================================
   *
   * Здесь теперь НЕ меняем page.
   *
   * Каталог не обновляется во время ввода.
   */

  function handleMinWidth(
    value: string
  ) {
    setMinWidth(value);
  }

  function handleMaxWidth(
    value: string
  ) {
    setMaxWidth(value);
  }

  /*
   * =========================================
   * ФИЛЬТР ВЫСОТЫ
   * =========================================
   */

  function handleMinHeight(
    value: string
  ) {
    setMinHeight(value);
  }

  function handleMaxHeight(
    value: string
  ) {
    setMaxHeight(value);
  }

  /*
   * =========================================
   * ЦЕНА
   * =========================================
   */

  function formatPrice(
    price: number
  ) {
    return (
      new Intl.NumberFormat(
        "ru-RU"
      ).format(price) +
      " ₽"
    );
  }

  /*
   * =========================================
   * ОТКРЫТИЕ КАРТИНЫ
   * =========================================
   *
   * Здесь дополнительно
   * записываем клик по картине.
   *
   * Клик:
   *
   * /api/stats/artwork/[id]/click
   *
   * После этого пользователь
   * сразу переходит на картину.
   */

  function openArtwork(
    artwork: Artwork
  ) {
    if (!artwork.slug) {
      router.push(
        "/#catalog"
      );

      return;
    }

    /*
     * =====================================
     * СТАТИСТИКА КЛИКА
     * =====================================
     *
     * Не используем await.
     *
     * Поэтому запрос статистики
     * не задерживает переход
     * пользователя.
     */

    fetch(
      `/api/stats/artwork/${artwork.id}/click`,
      {
        method: "POST",
      }
    ).catch((error) => {
      console.error(
        "Ошибка статистики клика:",
        error
      );
    });

    /*
     * =====================================
     * ПЕРЕХОД НА КАРТИНУ
     * =====================================
     */

    router.push(
      `/${artwork.slug}`
    );
  }

  /*
   * =========================================
   * ПЕРЕХОД НА СТРАНИЦУ
   * =========================================
   */

  function goToPage(
    targetPage: number
  ) {
    if (!pagination) {
      return;
    }

    if (
      targetPage < 1 ||
      targetPage >
        pagination.totalPages
    ) {
      return;
    }

    setPage(targetPage);

    requestAnimationFrame(() => {
      document
        .getElementById(
          "catalog"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  }

  /*
   * =========================================
   * НАЗАД
   * =========================================
   */

  function goToPreviousPage() {
    if (
      !pagination?.hasPreviousPage
    ) {
      return;
    }

    goToPage(
      pagination.page - 1
    );
  }

  /*
   * =========================================
   * ДАЛЕЕ
   * =========================================
   */

  function goToNextPage() {
    if (
      !pagination?.hasNextPage
    ) {
      return;
    }

    goToPage(
      pagination.page + 1
    );
  }

  /*
   * =========================================
   * ЗАГРУЗКА
   * =========================================
   */

  if (loading) {
    return (
      <section
        id="catalog"
        className="home-catalog"
      >
        <div className="embedded-catalog">
          <div className="catalog-loading">
            Загрузка картин...
          </div>
        </div>
      </section>
    );
  }

  /*
   * =========================================
   * ОШИБКА
   * =========================================
   */

  if (error) {
    return (
      <section
        id="catalog"
        className="home-catalog"
      >
        <div className="embedded-catalog">
          <div className="empty-catalog">

            <p>
              {error}
            </p>

            <button
              type="button"
              className="reset-filters"
              onClick={() =>
                window.location.reload()
              }
            >
              Обновить
            </button>

          </div>
        </div>
      </section>
    );
  }

  /*
   * =========================================
   * КАТАЛОГ
   * =========================================
   */

  return (
    <section
      id="catalog"
      className="home-catalog"
    >
      <div className="embedded-catalog">

        {/* =================================
            ЗАГОЛОВОК
        ================================= */}

        <div className="catalog-heading">

          <div>

            <p className="catalog-eyebrow">
              Галерея
            </p>

            <h2>
              Каталог
            </h2>

          </div>

          <p className="catalog-count">
            Найдено работ:{" "}
            {pagination?.total ??
              filteredArtworks.length}
          </p>

        </div>

        {/* =================================
            ОСНОВНОЙ LAYOUT
        ================================= */}

        <div className="catalog-layout">

          {/* =================================
              ФИЛЬТРЫ
          ================================= */}

          <aside className="catalog-filters">

            {/* СОРТИРОВКА */}

            <div className="filter-group">

              <label htmlFor="sort">
                Сортировка
              </label>

              <select
                id="sort"
                value={sort}
                onChange={(event) =>
                  handleSortChange(
                    event.target
                      .value as SortOption
                  )
                }
              >

                <option value="newest">
                  Сначала новые
                </option>

                <option value="oldest">
                  Сначала старые
                </option>

                <option value="priceAsc">
                  Цена: по возрастанию
                </option>

                <option value="priceDesc">
                  Цена: по убыванию
                </option>

              </select>

            </div>

            {/* ШИРИНА */}

            <div className="filter-group">

              <span className="filter-title">
                Ширина, см
              </span>

              <div className="filter-inputs">

                <input
                  type="number"
                  min="0"
                  placeholder="от"
                  value={minWidth}
                  onChange={(event) =>
                    handleMinWidth(
                      event.target.value
                    )
                  }
                />

                <span>
                  —
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="до"
                  value={maxWidth}
                  onChange={(event) =>
                    handleMaxWidth(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* ВЫСОТА */}

            <div className="filter-group">

              <span className="filter-title">
                Высота, см
              </span>

              <div className="filter-inputs">

                <input
                  type="number"
                  min="0"
                  placeholder="от"
                  value={minHeight}
                  onChange={(event) =>
                    handleMinHeight(
                      event.target.value
                    )
                  }
                />

                <span>
                  —
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="до"
                  value={maxHeight}
                  onChange={(event) =>
                    handleMaxHeight(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* ПРИМЕНИТЬ */}

            <button
              type="button"
              className="apply-filters"
              onClick={
                applyFilters
              }
            >
              Применить
            </button>

            {/* СБРОС */}

            <button
              type="button"
              className="reset-filters"
              onClick={
                resetFilters
              }
            >
              Сбросить
            </button>

          </aside>

          {/* =================================
              КАРТИНЫ
          ================================= */}

          <div className="artworks-grid">

            <AnimatePresence
              mode="popLayout"
            >

              {filteredArtworks.map(
                (artwork) => (

                  <motion.article
                    key={artwork.id}

                    layout

                    initial={{
                      opacity: 0,
                      scale: 0.97,
                    }}

                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}

                    exit={{
                      opacity: 0,
                      scale: 0.97,
                    }}

                    transition={{
                      duration: 0.35,
                    }}

                    className="artwork-card"

                    onClick={() =>
                      openArtwork(
                        artwork
                      )
                    }

                  >

                    {/* =================================
                        ИЗОБРАЖЕНИЕ
                    ================================= */}

                    <div
                      className="artwork-image-wrapper"
                    >

                      <Image
                        src={
                          artwork.image
                        }

                        alt={
                          artwork.title
                        }

                        width={
                          artwork.width > 0
                            ? artwork.width
                            : 1000
                        }

                        height={
                          artwork.height > 0
                            ? artwork.height
                            : 1000
                        }

                        sizes="
                          (max-width: 600px) 45vw,
                          (max-width: 900px) 30vw,
                          (max-width: 1300px) 23vw,
                          20vw
                        "

                        className="artwork-image"

                      />

                      {artwork.status ===
                        "sold" && (

                        <div className="artwork-status">
                          ПРОДАНО
                        </div>

                      )}

                    </div>

                    {/* =================================
                        ИНФОРМАЦИЯ
                    ================================= */}

                    <div className="artwork-info">

                      <div className="artwork-info-top">

                        <h2>
                          {
                            artwork.title
                          }
                        </h2>

                        <span className="artwork-price">
                          {formatPrice(
                            artwork.price
                          )}
                        </span>

                      </div>

                      <div className="artwork-details">

                        {
                          artwork.width
                        }{" "}
                        ×{" "}
                        {
                          artwork.height
                        }{" "}
                        см

                      </div>

                      <div className="artwork-year">

                        {
                          artwork.year
                        }

                      </div>

                    </div>

                  </motion.article>

                )
              )}

            </AnimatePresence>

          </div>

        </div>

        {/* =================================
            НЕТ КАРТИН
        ================================= */}

        {filteredArtworks.length ===
          0 && (

          <div className="empty-catalog">
            По выбранным параметрам
            картин не найдено.
          </div>

        )}

        {/* =================================
            ПАГИНАЦИЯ
        ================================= */}

        {pagination &&
          pagination.totalPages > 1 && (

          <div className="catalog-pagination">

            <button
              type="button"
              className="catalog-pagination-button catalog-pagination-arrow"
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={
                goToPreviousPage
              }
              aria-label="Предыдущая страница"
            >
              ←
            </button>

            <div className="catalog-pagination-pages">

              {Array.from(
                {
                  length:
                    pagination.totalPages,
                },
                (_, index) => {

                  const pageNumber =
                    index + 1;

                  const active =
                    pagination.page ===
                    pageNumber;

                  return (
                    <button
                      key={
                        pageNumber
                      }

                      type="button"

                      className={`catalog-pagination-page ${
                        active
                          ? "catalog-pagination-page-active"
                          : ""
                      }`}

                      onClick={() =>
                        goToPage(
                          pageNumber
                        )
                      }

                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }

                    >
                      {
                        pageNumber
                      }
                    </button>
                  );
                }
              )}

            </div>

            <button
              type="button"
              className="catalog-pagination-button catalog-pagination-arrow"
              disabled={
                !pagination.hasNextPage
              }
              onClick={
                goToNextPage
              }
              aria-label="Следующая страница"
            >
              →
            </button>

          </div>

        )}

        {/* =================================
            ИНФОРМАЦИЯ О СТРАНИЦЕ
        ================================= */}

        {filteredArtworks.length >
          0 && (

          <div className="catalog-pagination-info">

            Показано{" "}

            {Math.min(
              (pagination?.page ??
                page) *
                (pagination?.pageSize ??
                  20) -
                (pagination?.pageSize ??
                  20) +
                1,
              pagination?.total ??
                filteredArtworks.length
            )}

            –

            {Math.min(
              (pagination?.page ??
                page) *
                (pagination?.pageSize ??
                  20),
              pagination?.total ??
                filteredArtworks.length
            )}

            {" "}из{" "}

            {
              pagination?.total ??
              filteredArtworks.length
            }

          </div>

        )}

      </div>
    </section>
  );
}