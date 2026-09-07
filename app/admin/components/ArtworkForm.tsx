"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import styles from "./ArtworkForm.module.css";
import ImageUpload from "./ImageUpload";

export type ArtworkImage = {
  id: number;
  artworkId: number;
  image: string;
  order: number;
  createdAt: string;
};

type Artwork = {
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
  images: ArtworkImage[];
};

export type ArtworkFormData = Omit<
  Artwork,
  "id" | "images"
>;

type Props = {
  editingArtwork?: Artwork | null;

  onSaved: (artwork: Artwork) => void;

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
    useState<ArtworkFormData>(emptyArtwork);

  const [additionalImages, setAdditionalImages] =
    useState<ArtworkImage[]>([]);

  const [uploadingAdditional, setUploadingAdditional] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  /*
   * =========================================
   * ЗАПОЛНЕНИЕ ФОРМЫ ПРИ РЕДАКТИРОВАНИИ
   * =========================================
   */

  useEffect(() => {
    if (editingArtwork) {
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

        category: "Живопись",

        status: editingArtwork.status,
      });

      /*
       * Если дополнительные фотографии
       * уже пришли вместе с картиной,
       * показываем их сразу.
       */

      setAdditionalImages(
        [...(editingArtwork.images ?? [])].sort(
          (a, b) => a.order - b.order
        )
      );
    } else {
      setForm({
        ...emptyArtwork,
        year: new Date().getFullYear(),
      });

      setAdditionalImages([]);
    }
  }, [editingArtwork]);

  /*
   * =========================================
   * ИЗМЕНЕНИЕ ПОЛЕЙ
   * =========================================
   */

  function change<K extends keyof ArtworkFormData>(
    key: K,
    value: ArtworkFormData[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /*
   * =========================================
   * ЗАГРУЗКА ДОПОЛНИТЕЛЬНОЙ ФОТОГРАФИИ
   * =========================================
   */

  async function uploadAdditionalImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Для новой картины сначала нужно
     * сохранить саму картину.
     *
     * Поэтому дополнительные фотографии
     * добавляются после создания картины.
     */

    if (!editingArtwork) {
      showToast(
        "Сначала сохраните картину, затем добавьте дополнительные фотографии",
        "error"
      );

      event.target.value = "";

      return;
    }

    const artworkId = editingArtwork.id;

    setUploadingAdditional(true);

    try {
      /*
       * Загружаем файл на сервер.
       */

      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData: {
        url?: string;
        error?: string;
      } = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.error ||
            "Ошибка загрузки изображения"
        );
      }

      if (!uploadData.url) {
        throw new Error(
          "Сервер не вернул URL изображения"
        );
      }

      /*
       * Теперь сохраняем фотографию
       * именно для этой картины.
       */

      const response = await fetch(
        `/api/artworks/${artworkId}/images`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            image: uploadData.url,
          }),
        }
      );

      const data:
        | ArtworkImage
        | { error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Ошибка сохранения фотографии"
        );
      }

      const savedImage = data as ArtworkImage;

      setAdditionalImages((prev) =>
        [...prev, savedImage].sort(
          (a, b) => a.order - b.order
        )
      );

      showToast(
        "Дополнительная фотография добавлена"
      );
    } catch (error) {
      console.error(
        "Ошибка загрузки дополнительной фотографии:",
        error
      );

      showToast(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить фотографию",
        "error"
      );
    } finally {
      setUploadingAdditional(false);

      event.target.value = "";
    }
  }

  /*
   * =========================================
   * УДАЛЕНИЕ ДОПОЛНИТЕЛЬНОЙ ФОТОГРАФИИ
   * =========================================
   */

  async function deleteAdditionalImage(
    imageId: number
  ) {
    if (!editingArtwork) {
      showToast(
        "Не выбрана картина для редактирования",
        "error"
      );

      return;
    }

    const artworkId = editingArtwork.id;

    try {
      const response = await fetch(
        `/api/artworks/${artworkId}/images?imageId=${imageId}`,
        {
          method: "DELETE",
        }
      );

      const data: {
        success?: boolean;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Ошибка удаления фотографии"
        );
      }

      /*
       * Убираем фотографию из интерфейса.
       */

      setAdditionalImages((prev) =>
        prev
          .filter((item) => item.id !== imageId)
          .map((item, index) => ({
            ...item,
            order: index,
          }))
      );

      showToast(
        "Дополнительная фотография удалена"
      );
    } catch (error) {
      console.error(
        "Ошибка удаления дополнительной фотографии:",
        error
      );

      showToast(
        error instanceof Error
          ? error.message
          : "Не удалось удалить фотографию",
        "error"
      );
    }
  }

  /*
   * =========================================
   * СОХРАНЕНИЕ КАРТИНЫ
   * =========================================
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
        "Загрузите основное изображение",
        "error"
      );

      return;
    }

    if (form.width <= 0) {
      showToast(
        "Введите ширину картины",
        "error"
      );

      return;
    }

    if (form.height <= 0) {
      showToast(
        "Введите высоту картины",
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

      const response = await fetch(
        editingArtwork
          ? `/api/artworks/${editingArtwork.id}`
          : "/api/artworks",
        {
          method: editingArtwork
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      const data:
        | Artwork
        | { error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Ошибка сохранения"
        );
      }

      const artwork = data as Artwork;

      /*
       * После сохранения получаем актуальную
       * информацию о дополнительных фотографиях.
       */

      let finalArtwork = artwork;

      try {
        const imagesResponse =
          await fetch(
            `/api/artworks/${artwork.id}/images`,
            {
              cache: "no-store",
            }
          );

        if (imagesResponse.ok) {
          const imagesData: {
            images?: ArtworkImage[];
          } =
            await imagesResponse.json();

          finalArtwork = {
            ...artwork,

            images: (
              imagesData.images ?? []
            ).sort(
              (a, b) =>
                a.order - b.order
            ),
          };

          setAdditionalImages(
            finalArtwork.images
          );
        }
      } catch (error) {
        console.error(
          "Ошибка получения дополнительных фотографий:",
          error
        );
      }

      showToast(
        editingArtwork
          ? "Картина обновлена"
          : "Картина добавлена"
      );

      /*
       * Очищаем форму только после успешного
       * сохранения новой картины.
       */

      if (!editingArtwork) {
        setForm({
          ...emptyArtwork,
          year: new Date().getFullYear(),
        });

        setAdditionalImages([]);
      }

      onSaved(finalArtwork);
    } catch (error) {
      console.error(
        "Ошибка сохранения картины:",
        error
      );

      showToast(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при сохранении",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================
   * ОТМЕНА РЕДАКТИРОВАНИЯ
   * =========================================
   */

  function handleCancelEdit() {
    if (loading) {
      return;
    }

    setAdditionalImages([]);

    onCancelEdit();
  }

  return (
    <div className={styles.card}>
      {/* =====================================
          ЗАГОЛОВОК
      ===================================== */}

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
        {/* ===================================
            ОСНОВНОЕ ИЗОБРАЖЕНИЕ
        =================================== */}

        <div className={styles.imageSection}>
          <label className={styles.label}>
            Основное изображение
          </label>

          <ImageUpload
            value={form.image}
            onUploaded={(url: string) =>
              change("image", url)
            }
          />

          <p
            style={{
              marginTop: "8px",
              fontSize: "13px",
              color: "#777",
            }}
          >
            Это главное изображение картины,
            которое будет отображаться первым.
          </p>
        </div>

        {/* ===================================
            ДОПОЛНИТЕЛЬНЫЕ ФОТОГРАФИИ
        =================================== */}

        <div
          style={{
            marginTop: "28px",
          }}
        >
          <label className={styles.label}>
            Дополнительные фотографии
          </label>

          <p
            style={{
              marginTop: "6px",
              marginBottom: "14px",
              fontSize: "13px",
              lineHeight: "1.5",
              color: "#777",
            }}
          >
            Добавьте фотографии деталей,
            фактуры, рамы или другие изображения
            картины.
          </p>

          {!editingArtwork && (
            <div
              style={{
                marginBottom: "14px",
                padding: "12px 14px",
                background: "#f3f1ed",
                fontSize: "13px",
                lineHeight: "1.5",
                color: "#666",
              }}
            >
              Дополнительные фотографии можно
              добавить после первого сохранения
              картины.
            </div>
          )}

          {editingArtwork && (
            <>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "44px",
                  padding: "0 18px",
                  border: "1px solid #d8d4ce",
                  background: "#fff",
                  color: "#222",
                  cursor: uploadingAdditional
                    ? "default"
                    : "pointer",
                  fontSize: "14px",
                  opacity:
                    uploadingAdditional
                      ? 0.6
                      : 1,
                }}
              >
                {uploadingAdditional
                  ? "Загрузка..."
                  : "Добавить фотографию"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    uploadAdditionalImage
                  }
                  disabled={
                    uploadingAdditional
                  }
                  style={{
                    display: "none",
                  }}
                />
              </label>

              {/* ===========================
                  СПИСОК ФОТО
              =========================== */}

              {additionalImages.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "14px",
                    marginTop: "18px",
                  }}
                >
                  {additionalImages.map(
                    (item, index) => (
                      <div
                        key={item.id}
                        style={{
                          position:
                            "relative",
                          overflow:
                            "hidden",
                          background:
                            "#f3f1ed",
                          border:
                            "1px solid #ddd8d0",
                        }}
                      >
                        <div
                          style={{
                            position:
                              "relative",
                            aspectRatio:
                              "1 / 1",
                            overflow:
                              "hidden",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={`Дополнительная фотография ${
                              index + 1
                            }`}
                            style={{
                              display:
                                "block",
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            gap: "8px",
                            padding:
                              "9px",
                          }}
                        >
                          <span
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777",
                            }}
                          >
                            Фото{" "}
                            {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              deleteAdditionalImage(
                                item.id
                              )
                            }
                            disabled={
                              loading
                            }
                            style={{
                              border:
                                "none",
                              background:
                                "transparent",
                              padding:
                                "4px 0",
                              color:
                                "#a33",
                              cursor:
                                loading
                                  ? "default"
                                  : "pointer",
                              fontSize:
                                "12px",
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {additionalImages.length ===
                0 && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "18px",
                    border:
                      "1px dashed #d8d4ce",
                    color: "#888",
                    fontSize: "13px",
                    textAlign:
                      "center",
                  }}
                >
                  Дополнительных фотографий
                  пока нет
                </div>
              )}
            </>
          )}
        </div>

        {/* ===================================
            ОСНОВНЫЕ ПОЛЯ
        =================================== */}

        <div className={styles.grid}>
          {/* НАЗВАНИЕ */}

          <div className={styles.field}>
            <label
              htmlFor="artwork-title"
              className={styles.label}
            >
              Название
            </label>

            <input
              id="artwork-title"
              className={styles.input}
              placeholder="Например: Утро в горах"
              value={form.title}
              onChange={(e) =>
                change(
                  "title",
                  e.target.value
                )
              }
            />
          </div>

          {/* ЦЕНА */}

          <div className={styles.field}>
            <label
              htmlFor="artwork-price"
              className={styles.label}
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
                className={styles.input}
                type="number"
                min="0"
                placeholder="0"
                value={form.price}
                onChange={(e) =>
                  change(
                    "price",
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <span>₽</span>
            </div>
          </div>

          {/* ГОД */}

          <div className={styles.field}>
            <label
              htmlFor="artwork-year"
              className={styles.label}
            >
              Год создания
            </label>

            <input
              id="artwork-year"
              className={styles.input}
              type="number"
              min="1900"
              max="2100"
              placeholder="2026"
              value={form.year}
              onChange={(e) =>
                change(
                  "year",
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </div>

          {/* МАТЕРИАЛ */}

          <div className={styles.field}>
            <label
              htmlFor="artwork-material"
              className={styles.label}
            >
              Материал
            </label>

            <input
              id="artwork-material"
              className={styles.input}
              placeholder="Например: Холст, масло"
              value={form.material}
              onChange={(e) =>
                change(
                  "material",
                  e.target.value
                )
              }
            />
          </div>

          {/* ШИРИНА */}

          <div className={styles.field}>
            <label
              htmlFor="artwork-width"
              className={styles.label}
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
                className={styles.input}
                type="number"
                min="0"
                placeholder="80"
                value={form.width}
                onChange={(e) =>
                  change(
                    "width",
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <span>см</span>
            </div>
          </div>

          {/* ВЫСОТА */}

          <div className={styles.field}>
            <label
              htmlFor="artwork-height"
              className={styles.label}
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
                className={styles.input}
                type="number"
                min="0"
                placeholder="100"
                value={form.height}
                onChange={(e) =>
                  change(
                    "height",
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <span>см</span>
            </div>
          </div>

          {/* СТАТУС */}

          <div className={styles.field}>
            <label
              htmlFor="artwork-status"
              className={styles.label}
            >
              Статус
            </label>

            <select
              id="artwork-status"
              className={styles.select}
              value={form.status}
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

          <div className={styles.field}>
            <label
              htmlFor="artwork-category"
              className={styles.label}
            >
              Категория
            </label>

            <input
              id="artwork-category"
              className={styles.input}
              value="Живопись"
              disabled
            />
          </div>
        </div>

        {/* ===================================
            ОПИСАНИЕ
        =================================== */}

        <div className={styles.field}>
          <label
            htmlFor="artwork-description"
            className={styles.label}
          >
            Описание
          </label>

          <textarea
            id="artwork-description"
            className={styles.textarea}
            placeholder="Введите описание картины..."
            rows={6}
            value={form.description}
            onChange={(e) =>
              change(
                "description",
                e.target.value
              )
            }
          />
        </div>

        {/* ===================================
            КНОПКИ
        =================================== */}

        <div className={styles.buttons}>
          {editingArtwork && (
            <button
              type="button"
              className={styles.cancel}
              onClick={
                handleCancelEdit
              }
              disabled={loading}
            >
              Отмена
            </button>
          )}

          <button
            type="button"
            className={styles.save}
            onClick={saveArtwork}
            disabled={loading}
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