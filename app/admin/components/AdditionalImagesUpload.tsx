"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ArtworkImage = {
  id: number;
  artworkId: number;
  image: string;
  order: number;
  createdAt: string;
};

type Props = {
  artworkId?: number;
};

export default function AdditionalImagesUpload({
  artworkId,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [images, setImages] =
    useState<ArtworkImage[]>([]);

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadImages() {
    if (!artworkId) {
      setImages([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/artworks/${artworkId}/images`,
        {
          cache: "no-store",
        }
      );

      const data: {
        images?: ArtworkImage[];
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Ошибка загрузки фотографий"
        );
      }

      setImages(data.images || []);
    } catch (error) {
      console.error(
        "Ошибка загрузки дополнительных фотографий:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить фотографии"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, [artworkId]);

  async function uploadImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!artworkId) {
      setError(
        "Сначала сохраните картину, затем добавляйте дополнительные фотографии."
      );

      return;
    }

    setError("");
    setUploading(true);

    try {
      /*
       * Сначала загружаем файл.
       */

      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse =
        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

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
       * Теперь сохраняем URL
       * в artworkImage.
       */

      const imageResponse =
        await fetch(
          `/api/artworks/${artworkId}/images`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              image: uploadData.url,
            }),
          }
        );

      const imageData:
        | ArtworkImage
        | { error?: string } =
        await imageResponse.json();

      if (!imageResponse.ok) {
        throw new Error(
          "error" in imageData
            ? imageData.error ||
                "Ошибка сохранения фотографии"
            : "Ошибка сохранения фотографии"
        );
      }

      /*
       * Обновляем список.
       */

      await loadImages();
    } catch (error) {
      console.error(
        "Ошибка добавления дополнительной фотографии:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не удалось добавить фотографию"
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function deleteImage(
    imageId: number
  ) {
    if (!artworkId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Удалить эту фотографию?"
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response =
        await fetch(
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

      setImages((prev) =>
        prev.filter(
          (image) =>
            image.id !== imageId
        )
      );
    } catch (error) {
      console.error(
        "Ошибка удаления фотографии:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не удалось удалить фотографию"
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginTop: "10px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#777",
            marginBottom: "8px",
          }}
        >
          Дополнительные фотографии
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#888",
            lineHeight: 1.5,
          }}
        >
          Эти фотографии будут отображаться
          на странице картины под основным
          изображением.
        </div>
      </div>

      {!artworkId && (
        <div
          style={{
            padding: "12px 14px",
            background: "#f3f1ed",
            color: "#777",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Сначала сохраните картину.
          После сохранения здесь можно
          добавлять дополнительные фотографии.
        </div>
      )}

      {artworkId && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
          />

          {uploading && (
            <div
              style={{
                fontSize: "14px",
                color: "#777",
              }}
            >
              Загрузка фотографии...
            </div>
          )}

          {loading && (
            <div
              style={{
                fontSize: "14px",
                color: "#777",
              }}
            >
              Загрузка списка фотографий...
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "10px 12px",
                background: "#fff1f0",
                color: "#b42318",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    background:
                      "#f3f1ed",
                  }}
                >
                  <img
                    src={image.image}
                    alt="Дополнительная фотография"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(image.id)
                    }
                    style={{
                      position:
                        "absolute",
                      top: "8px",
                      right: "8px",
                      width: "30px",
                      height: "30px",
                      border: "0",
                      borderRadius: "50%",
                      background:
                        "rgba(0, 0, 0, 0.65)",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "18px",
                      lineHeight: 1,
                    }}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading &&
            images.length === 0 && (
              <div
                style={{
                  padding: "18px",
                  border:
                    "1px dashed #d8d4ce",
                  color: "#888",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                Дополнительных фотографий
                пока нет.
              </div>
            )}
        </>
      )}
    </div>
  );
}