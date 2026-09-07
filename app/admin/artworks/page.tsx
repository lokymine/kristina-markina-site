"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/components/admin/layout/AdminLayout";

import ArtworkForm, {
  Artwork,
} from "@/components/admin/ArtworkForm";

import ArtworkTable from "@/components/admin/ArtworkTable";

import DeleteModal from "@/components/admin/DeleteModal";

import ArtworkDashboard from "@/components/admin/dashboard/ArtworkDashboard";

import Toolbar from "@/components/admin/toolbar/Toolbar";

import Toast, {
  ToastType,
} from "@/components/admin/toast/Toast";

import ArtworkPreview from "@/components/admin/ArtworkPreview";

import styles from "./page.module.css";

type ArtworksResponse = {
  artworks: Artwork[];

  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

export default function ArtworksPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [artworks, setArtworks] =
    useState<Artwork[]>([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("new");

  const [
    editingArtwork,
    setEditingArtwork,
  ] = useState<Artwork | null>(null);

  const [
    deletingArtwork,
    setDeletingArtwork,
  ] = useState<Artwork | null>(null);

  const [
    previewArtwork,
    setPreviewArtwork,
  ] = useState<Artwork | null>(null);

  const [selected, setSelected] =
    useState<number[]>([]);

  const [toastShow, setToastShow] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<ToastType>("success");

  /*
   * =================================
   * TOAST
   * =================================
   */

  function showToast(
    message: string,
    type: ToastType = "success"
  ) {
    setToastMessage(message);
    setToastType(type);
    setToastShow(true);

    setTimeout(() => {
      setToastShow(false);
    }, 3000);
  }

  /*
   * =================================
   * ЗАГРУЗКА КАРТИН
   * =================================
   */

  async function loadArtworks() {
    try {
      const response = await fetch(
        "/api/artworks?admin=true",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Ошибка загрузки картин"
        );
      }

      const data =
        await response.json();

      if (
        Array.isArray(data)
      ) {
        setArtworks(data);
        return;
      }

      if (
        Array.isArray(
          data.artworks
        )
      ) {
        setArtworks(
          data.artworks
        );

        return;
      }

      setArtworks([]);
    } catch (error) {
      console.error(
        "Ошибка загрузки картин:",
        error
      );

      setArtworks([]);

      showToast(
        "Ошибка загрузки картин",
        "error"
      );
    }
  }

  /*
   * =================================
   * ВЫХОД
   * =================================
   */

  async function logout() {
    try {
      await fetch(
        "/api/admin/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Ошибка выхода:",
        error
      );
    }

    router.replace(
      "/admin/login"
    );
  }

  /*
   * =================================
   * ВЫБОР КАРТИНЫ
   * =================================
   */

  function toggleArtwork(
    id: number
  ) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (item) => item !== id
        );
      }

      return [...prev, id];
    });
  }

  /*
   * =================================
   * ВЫБРАТЬ / СНЯТЬ ВСЕ
   * =================================
   */

  function toggleAll() {
    if (
      selected.length ===
      filteredArtworks.length
    ) {
      setSelected([]);

      return;
    }

    setSelected(
      filteredArtworks.map(
        (artwork) =>
          artwork.id
      )
    );
  }

  /*
   * =================================
   * МАССОВОЕ УДАЛЕНИЕ
   * =================================
   */

  async function deleteSelected() {
    if (
      selected.length === 0
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          "/api/artworks/bulk-delete",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ids: selected,
            }),
          }
        );

      if (!response.ok) {
        showToast(
          "Ошибка удаления",
          "error"
        );

        return;
      }

      showToast(
        `Удалено ${selected.length} картин`
      );

      setSelected([]);

      await loadArtworks();

      setDeletingArtwork(null);

      setEditingArtwork(null);

      setPreviewArtwork(null);
    } catch (error) {
      console.error(error);

      showToast(
        "Ошибка удаления",
        "error"
      );
    }
  }

  /*
   * =================================
   * ПЕРЕОРГАНИЗАЦИЯ
   * =================================
   */

  function handleReorder(
    newArtworks: Artwork[]
  ) {
    setArtworks(
      newArtworks
    );
  }

  /*
   * =================================
   * АВТОРИЗАЦИЯ
   * =================================
   */

  useEffect(() => {
    async function init() {
      try {
        const response =
          await fetch(
            "/api/admin/check",
            {
              credentials:
                "include",

              cache:
                "no-store",
            }
          );

        if (!response.ok) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        setAuthorized(true);

        await loadArtworks();
      } catch (error) {
        console.error(error);

        router.replace(
          "/admin/login"
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  /*
   * =================================
   * LOADING
   * =================================
   */

  if (loading) {
    return (
      <main
        className={
          styles.center
        }
      >
        Загрузка...
      </main>
    );
  }

  /*
   * =================================
   * НЕ АВТОРИЗОВАН
   * =================================
   */

  if (!authorized) {
    return null;
  }

  /*
   * =================================
   * ФИЛЬТРАЦИЯ + СОРТИРОВКА
   * =================================
   */

  const filteredArtworks =
    [...artworks]
      .filter((artwork) => {
        const titleMatch =
          artwork.title
            .toLowerCase()
            .includes(
              search
                .toLowerCase()
                .trim()
            );

        const statusMatch =
          status === "all"
            ? true
            : artwork.status ===
              status;

        return (
          titleMatch &&
          statusMatch
        );
      })
      .sort((a, b) => {
        switch (sort) {
          case "old":
            return (
              a.id - b.id
            );

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

          case "yearAsc":
            return (
              a.year -
              b.year
            );

          case "yearDesc":
            return (
              b.year -
              a.year
            );

          case "name":
            return a.title.localeCompare(
              b.title,
              "ru"
            );

          case "new":
          default:
            return (
              b.id - a.id
            );
        }
      });

  /*
   * =================================
   * RENDER
   * =================================
   */

  return (
    <>
      {/* =============================
          TOAST
      ============================= */}

      <Toast
        show={toastShow}
        message={toastMessage}
        type={toastType}
      />

      {/* =============================
          ПРЕДПРОСМОТР
      ============================= */}

      <ArtworkPreview
        artwork={
          previewArtwork
        }
        onClose={() =>
          setPreviewArtwork(
            null
          )
        }
        onEdit={(artwork) => {
          setPreviewArtwork(
            null
          );

          setEditingArtwork(
            artwork
          );
        }}
        onDelete={(artwork) => {
          setPreviewArtwork(
            null
          );

          setDeletingArtwork(
            artwork
          );
        }}
      />

      {/* =============================
          УДАЛЕНИЕ
      ============================= */}

      <DeleteModal
        artwork={
          deletingArtwork
        }
        onClose={() =>
          setDeletingArtwork(
            null
          )
        }
        onDeleted={(id) => {
          setArtworks((prev) =>
            prev.filter(
              (artwork) =>
                artwork.id !==
                id
            )
          );

          setSelected((prev) =>
            prev.filter(
              (item) =>
                item !== id
            )
          );

          setDeletingArtwork(
            null
          );

          showToast(
            "Картина удалена"
          );
        }}
      />

      {/* =============================
          ADMIN LAYOUT
      ============================= */}

      <AdminLayout
        onLogout={logout}
      >
        <main
          className={
            styles.page
          }
        >
          {/* =========================
              HEADER
          ========================= */}

          <header
            className={
              styles.header
            }
          >
            <div>
              <h1>
                Картины
              </h1>

              <p>
                Управление каталогом картин
              </p>
            </div>
          </header>

          {/* =========================
              DASHBOARD
          ========================= */}

          <ArtworkDashboard
            artworks={
              artworks
            }
          />

          {/* =========================
              TOOLBAR
          ========================= */}

          <Toolbar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
          />

          {/* =========================
              ФОРМА
          ========================= */}

          <ArtworkForm
            editingArtwork={
              editingArtwork
            }
            onCancelEdit={() =>
              setEditingArtwork(
                null
              )
            }
            onSaved={(artwork) => {
              setArtworks(
                (prev) => {
                  const exists =
                    prev.some(
                      (item) =>
                        item.id ===
                        artwork.id
                    );

                  /*
                   * РЕДАКТИРОВАНИЕ
                   */

                  if (exists) {
                    return prev.map(
                      (item) =>
                        item.id ===
                        artwork.id
                          ? artwork
                          : item
                    );
                  }

                  /*
                   * НОВАЯ КАРТИНА
                   */

                  return [
                    artwork,
                    ...prev,
                  ];
                }
              );

              setEditingArtwork(
                null
              );

              showToast(
                "Картина сохранена"
              );
            }}
            showToast={
              showToast
            }
          />

          {/* =========================
              BULK BAR
          ========================= */}

          {selected.length >
            0 && (
            <div
              className={
                styles.bulkBar
              }
            >
              <span>
                Выбрано:{" "}
                <b>
                  {
                    selected.length
                  }
                </b>
              </span>

              <button
                type="button"
                onClick={
                  deleteSelected
                }
              >
                Удалить выбранные
              </button>
            </div>
          )}

          {/* =========================
              TABLE
          ========================= */}

          <ArtworkTable
            artworks={
              filteredArtworks
            }
            selected={
              selected
            }
            onToggle={
              toggleArtwork
            }
            onToggleAll={
              toggleAll
            }
            onPreview={(artwork) =>
              setPreviewArtwork(
                artwork
              )
            }
            onEdit={(artwork) =>
              setEditingArtwork(
                artwork
              )
            }
            onDelete={(artwork) =>
              setDeletingArtwork(
                artwork
              )
            }
            onReorder={
              handleReorder
            }
          />
        </main>
      </AdminLayout>
    </>
  );
}