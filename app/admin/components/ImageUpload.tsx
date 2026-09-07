"use client";

import { ChangeEvent, useRef, useState } from "react";

type Props = {
  value: string;
  onUploaded: (url: string) => void;
};

export default function ImageUpload({
  value,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(
    null
  );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data: {
        url?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Ошибка загрузки изображения"
        );
      }

      if (!data.url) {
        throw new Error(
          "Сервер не вернул URL изображения"
        );
      }

      onUploaded(data.url);
    } catch (error) {
      console.error(
        "Ошибка загрузки изображения:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить изображение"
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
      />

      {uploading && (
        <div
          style={{
            fontSize: "14px",
            color: "#777",
          }}
        >
          Загрузка изображения...
        </div>
      )}

      {error && (
        <div
          style={{
            fontSize: "14px",
            color: "#b42318",
          }}
        >
          {error}
        </div>
      )}

      {value && (
        <div
          style={{
            width: "180px",
            height: "180px",
            overflow: "hidden",
            background: "#f3f1ed",
          }}
        >
          <img
            src={value}
            alt="Предпросмотр"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}
    </div>
  );
}