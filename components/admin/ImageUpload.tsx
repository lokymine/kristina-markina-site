"use client";

import { useRef, useState } from "react";
import styles from "./ImageUpload.module.css";
import UploadProgress from "./upload/UploadProgress";

type Props = {
  value: string;
  onUploaded: (url: string) => void;
};

export default function ImageUpload({
  value,
  onUploaded,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [loading, setLoading] =
    useState(false);
    
  const [progress,setProgress] =
    useState(0);

  const [dragging, setDragging] =
    useState(false);

  async function upload(file: File) {

    setLoading(true);
    setProgress(0);
    const formData=new FormData();
    formData.append("file",file);
    const xhr=new XMLHttpRequest();
    xhr.upload.onprogress=(event)=>{
        if(event.lengthComputable){
            setProgress(
            Math.round(
            event.loaded*100/event.total
            )
            );
        }
    };
    xhr.onload=()=>{
        setLoading(false);
        if(xhr.status!==200){
            alert("Ошибка загрузки");
            return;
        }
        const data=JSON.parse(xhr.response);
        onUploaded(data.url);
    };
    xhr.onerror=()=>{
        setLoading(false);
        alert("Ошибка загрузки");
    };
    xhr.open("POST","/api/upload");
    xhr.send(formData);
    }

  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    upload(file);
  }

  function onDrop(
    e: React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();

    setDragging(false);

    const file =
      e.dataTransfer.files?.[0];

    if (!file) return;

    upload(file);
  }

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={onInputChange}
      />

      <div
        className={`${styles.dropzone} ${
          dragging
            ? styles.dragging
            : ""
        }`}
        onClick={() =>
          inputRef.current?.click()
        }
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragLeave={() =>
          setDragging(false)
        }
        onDrop={onDrop}
      >
        {loading ? (
        <UploadProgress
        progress={progress}
        />
        ) : value ? (
          <>
            <img
              src={value}
              className={
                styles.preview
              }
              alt=""
            />
            <button
                className={styles.remove}
                onClick={(e)=>{
                    e.stopPropagation();
                    onUploaded("");
                }}
                >
                ✕
            </button>

            <div
              className={
                styles.change
              }
            >
              Нажмите или
              перетащите другое
              изображение
            </div>
          </>
        ) : (
          <>
            <div
              className={
                styles.icon
              }
            >
              📷
            </div>

            <div
              className={
                styles.title
              }
            >
              Перетащите
              изображение
            </div>

            <div
              className={
                styles.subtitle
              }
            >
              или нажмите для
              выбора файла
            </div>
          </>
        )}
      </div>
    </>
  );
}