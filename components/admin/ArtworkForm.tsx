"use client";

import {
  useEffect,
  useState,
} from "react";

import styles from "./ArtworkForm.module.css";
import ImageUpload from "./ImageUpload";

export type ArtworkImage = {
  id: number;
  artworkId: number;
  image: string;
  order: number;
};

export type Artwork = {
  id: number;

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

  images?: ArtworkImage[];
};

export type ArtworkFormData =
  Omit<Artwork, "id" | "images">;

type Props = {
  editingArtwork?: Artwork | null;

  onSaved: (
    artwork: Artwork
  ) => void;

  onCancelEdit: () => void;

  showToast: (
    message: string,
    type?: "success" | "error"
  ) => void;
};

const emptyArtwork: ArtworkFormData = {
  title: "",
  image: "",
  year: new Date().getFullYear(),
  price: 0,
  width: 0,
  height: 0,
  material: "",
  size: "",
  description: "",
  category: "Живопись",
  status: "available",
};

export default function ArtworkForm({
  editingArtwork,
  onSaved,
  onCancelEdit,
  showToast,
}: Props) {
  const [form, setForm] =
    useState<ArtworkFormData>(
      emptyArtwork
    );

  const [additionalImages, setAdditionalImages] =
    useState<ArtworkImage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [imagesLoading, setImagesLoading] =
    useState(false);

  /*
   * =================================
   * ЗАГРУЗКА ДАННЫХ
   * =================================
   */

  useEffect(() => {
    if (!editingArtwork) {
      setForm({
        ...emptyArtwork,
        year: new Date().getFullYear(),
      });

      setAdditionalImages([]);

      return;
    }

    setForm({
      title: editingArtwork.title,
      image: editingArtwork.image,
      year: editingArtwork.year,
      price: editingArtwork.price,
      width: editingArtwork.width,
      height: editingArtwork.height,
      material: editingArtwork.material,
      size: editingArtwork.size,
      description: editingArtwork.description,
      category: editingArtwork.category,
      status: editingArtwork.status,
    });

    /*
     * Если фотографии уже пришли
     * вместе с картиной — используем их.
     */

    if (editingArtwork.images) {
      setAdditionalImages(
        editingArtwork.images
      );

      return;
    }

    /*
     * Иначе загружаем их отдельно.
     */

    loadAdditionalImages(
      editingArtwork.id
    );
  }, [editingArtwork]);

  /*
   * =================================
   * ЗАГРУЗКА ДОП. ФОТО
   * =================================
   */

  async function loadAdditionalImages(
    artworkId: number
  ) {
    setImagesLoading(true);

    try {
      const response =
        await fetch(
          `/api/artworks/${artworkId}/images`,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Ошибка загрузки фотографий"
        );
      }

      const data =
        await response.json();

      setAdditionalImages(
        data.images || []
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Не удалось загрузить дополнительные фотографии",
        "error"
      );
    } finally {
      setImagesLoading(false);
    }
  }

  /*
   * =================================
   * CHANGE
   * =================================
   */

  function change<
    K extends keyof ArtworkFormData
  >(
    key: K,
    value: ArtworkFormData[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /*
   * =================================
   * ДОБАВЛЕНИЕ ФОТО
   * =================================
   */

  async function addAdditionalImage(
    url: string
  ) {
    if (!url) {
      return;
    }

    /*
     * Новую картину сначала сохраняем,
     * потому что дополнительное фото
     * должно иметь artworkId.
     */

    if (!editingArtwork) {
      showToast(
        "Сначала добавьте картину, затем можно добавить дополнительные фотографии",
        "error"
      );

      return;
    }

    try {
      const response =
        await fetch(
          `/api/artworks/${editingArtwork.id}/images`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              image: url,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Ошибка добавления фотографии"
        );
      }

      const image =
        await response.json();

      setAdditionalImages(
        (prev) => [
          ...prev,
          image,
        ]
      );

      showToast(
        "Дополнительная фотография добавлена"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Не удалось добавить фотографию",
        "error"
      );
    }
  }

  /*
   * =================================
   * УДАЛЕНИЕ ФОТО
   * =================================
   */

  async function deleteAdditionalImage(
    imageId: number
  ) {
    if (!editingArtwork) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/artworks/${editingArtwork.id}/images?imageId=${imageId}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Ошибка удаления фотографии"
        );
      }

      setAdditionalImages(
        (prev) =>
          prev.filter(
            (image) =>
              image.id !== imageId
          )
      );

      showToast(
        "Фотография удалена"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Не удалось удалить фотографию",
        "error"
      );
    }
  }

  /*
   * =================================
   * СОХРАНЕНИЕ КАРТИНЫ
   * =================================
   */

  async function saveArtwork() {
    if (!form.title.trim()) {
      showToast(
        "Введите название",
        "error"
      );

      return;
    }

    if (!form.image) {
      showToast(
        "Загрузите изображение",
        "error"
      );

      return;
    }

    setLoading(true);

    try {
      const body = {
        ...form,

        size: `${form.width} × ${form.height} см`,

        category: "Живопись",
      };

      const response =
        await fetch(
          editingArtwork
            ? `/api/artworks/${editingArtwork.id}`
            : "/api/artworks",
          {
            method:
              editingArtwork
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              body
            ),
          }
        );

      if (!response.ok) {
        showToast(
          "Ошибка сохранения",
          "error"
        );

        return;
      }

      const artwork =
        await response.json();

      showToast(
        editingArtwork
          ? "Картина обновлена"
          : "Картина добавлена"
      );

      /*
       * Если это новая картина,
       * она теперь получила ID.
       *
       * После сохранения пользователь
       * сможет добавить дополнительные
       * фотографии.
       */

      setForm({
        ...emptyArtwork,
        year: new Date().getFullYear(),
      });

      setAdditionalImages([]);

      onSaved(artwork);
    } catch (error) {
      console.error(error);

      showToast(
        "Произошла ошибка при сохранении",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>
          {editingArtwork
            ? "Редактирование картины"
            : "Добавить картину"}
        </h2>

        <p>
          Заполните информацию о произведении
        </p>
      </div>

      <div className={styles.form}>
        {/* =========================================
            ОСНОВНОЕ ИЗОБРАЖЕНИЕ
        ========================================= */}

        <div
          className={styles.imageSection}
        >
          <label
            className={styles.label}
          >
            Основное изображение
          </label>

          <ImageUpload
            value={form.image}
            onUploaded={(url) =>
              change(
                "image",
                url
              )
            }
          />
        </div>

        {/* =========================================
            ДОПОЛНИТЕЛЬНЫЕ ФОТО
        ========================================= */}

        {editingArtwork && (
          <div
            className={
              styles.imageSection
            }
          >
            <label
              className={styles.label}
            >
              Дополнительные фотографии
            </label>

            <p
              style={{
                marginTop: 0,
                marginBottom:
                  "12px",
                fontSize:
                  "14px",
                color:
                  "#777",
              }}
            >
              Можно добавить несколько
              фотографий картины.
            </p>

            <ImageUpload
              value=""
              onUploaded={
                addAdditionalImage
              }
            />

            {imagesLoading && (
              <p
                style={{
                  marginTop:
                    "12px",
                }}
              >
                Загрузка фотографий...
              </p>
            )}

            {additionalImages.length >
              0 && (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "12px",
                  marginTop:
                    "20px",
                }}
              >
                {additionalImages.map(
                  (
                    image
                  ) => (
                    <div
                      key={
                        image.id
                      }
                      style={{
                        position:
                          "relative",
                        border:
                          "1px solid #ddd",
                        borderRadius:
                          "8px",
                        overflow:
                          "hidden",
                        background:
                          "#f5f5f5",
                      }}
                    >
                      <img
                        src={
                          image.image
                        }
                        alt="Дополнительная фотография"
                        style={{
                          width:
                            "100%",
                          height:
                            "120px",
                          objectFit:
                            "cover",
                          display:
                            "block",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          deleteAdditionalImage(
                            image.id
                          )
                        }
                        style={{
                          position:
                            "absolute",
                          top: "6px",
                          right: "6px",
                          border:
                            "none",
                          background:
                            "rgba(0,0,0,.7)",
                          color:
                            "#fff",
                          width:
                            "28px",
                          height:
                            "28px",
                          borderRadius:
                            "50%",
                          cursor:
                            "pointer",
                          fontSize:
                            "16px",
                          lineHeight:
                            "28px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        <div
          className={styles.grid}
        >
          {/* НАЗВАНИЕ */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-title"
              className={
                styles.label
              }
            >
              Название
            </label>

            <input
              id="artwork-title"
              className={
                styles.input
              }
              placeholder="Например: Утро в горах"
              value={
                form.title
              }
              onChange={(e) =>
                change(
                  "title",
                  e.target.value
                )
              }
            />
          </div>

          {/* ЦЕНА */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-price"
              className={
                styles.label
              }
            >
              Цена
            </label>

            <div
              className={
                styles.inputWithSuffix
              }
            >
              <input
                id="artwork-price"
                className={
                  styles.input
                }
                type="number"
                min="0"
                placeholder="0"
                value={
                  form.price
                }
                onChange={(e) =>
                  change(
                    "price",
                    Number(
                      e.target
                        .value
                    )
                  )
                }
              />

              <span>
                ₽
              </span>
            </div>
          </div>

          {/* ГОД */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-year"
              className={
                styles.label
              }
            >
              Год создания
            </label>

            <input
              id="artwork-year"
              className={
                styles.input
              }
              type="number"
              min="1900"
              max="2100"
              value={
                form.year
              }
              onChange={(e) =>
                change(
                  "year",
                  Number(
                    e.target
                      .value
                  )
                )
              }
            />
          </div>

          {/* МАТЕРИАЛ */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-material"
              className={
                styles.label
              }
            >
              Материал
            </label>

            <input
              id="artwork-material"
              className={
                styles.input
              }
              placeholder="Например: Холст, масло"
              value={
                form.material
              }
              onChange={(e) =>
                change(
                  "material",
                  e.target.value
                )
              }
            />
          </div>

          {/* ШИРИНА */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-width"
              className={
                styles.label
              }
            >
              Ширина
            </label>

            <div
              className={
                styles.inputWithSuffix
              }
            >
              <input
                id="artwork-width"
                className={
                  styles.input
                }
                type="number"
                min="0"
                value={
                  form.width
                }
                onChange={(e) =>
                  change(
                    "width",
                    Number(
                      e.target
                        .value
                    )
                  )
                }
              />

              <span>
                см
              </span>
            </div>
          </div>

          {/* ВЫСОТА */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-height"
              className={
                styles.label
              }
            >
              Высота
            </label>

            <div
              className={
                styles.inputWithSuffix
              }
            >
              <input
                id="artwork-height"
                className={
                  styles.input
                }
                type="number"
                min="0"
                value={
                  form.height
                }
                onChange={(e) =>
                  change(
                    "height",
                    Number(
                      e.target
                        .value
                    )
                  )
                }
              />

              <span>
                см
              </span>
            </div>
          </div>

          {/* СТАТУС */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-status"
              className={
                styles.label
              }
            >
              Статус
            </label>

            <select
              id="artwork-status"
              className={
                styles.select
              }
              value={
                form.status
              }
              onChange={(e) =>
                change(
                  "status",
                  e.target.value
                )
              }
            >
              <option value="available">
                В наличии
              </option>

              <option value="sold">
                Продано
              </option>
            </select>
          </div>

          {/* КАТЕГОРИЯ */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="artwork-category"
              className={
                styles.label
              }
            >
              Категория
            </label>

            <input
              id="artwork-category"
              className={
                styles.input
              }
              value="Живопись"
              disabled
            />
          </div>
        </div>

        {/* ОПИСАНИЕ */}

        <div
          className={styles.field}
        >
          <label
            htmlFor="artwork-description"
            className={
              styles.label
            }
          >
            Описание
          </label>

          <textarea
            id="artwork-description"
            className={
              styles.textarea
            }
            placeholder="Введите описание картины..."
            rows={6}
            value={
              form.description
            }
            onChange={(e) =>
              change(
                "description",
                e.target.value
              )
            }
          />
        </div>

        {/* КНОПКИ */}

        <div
          className={styles.buttons}
        >
          {editingArtwork && (
            <button
              type="button"
              className={
                styles.cancel
              }
              onClick={
                onCancelEdit
              }
              disabled={
                loading
              }
            >
              Отмена
            </button>
          )}

          <button
            type="button"
            className={
              styles.save
            }
            onClick={
              saveArtwork
            }
            disabled={
              loading
            }
          >
            {loading
              ? "Сохранение..."
              : editingArtwork
              ? "Сохранить изменения"
              : "Добавить картину"}
          </button>
        </div>
      </div>
    </div>
  );
}