"use client";

import { Artwork } from "./ArtworkForm";
import StatusBadge from "./StatusBadge";
import styles from "./ArtworkPreview.module.css";

type Props = {
  artwork: Artwork | null;
  onClose: () => void;
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
};

export default function ArtworkPreview({
  artwork,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!artwork) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <button
          className={styles.close}
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={artwork.image}
          alt={artwork.title}
          className={styles.image}
        />

        <div className={styles.content}>
          <h2>{artwork.title}</h2>

          <StatusBadge
            status={artwork.status}
          />

          <div className={styles.info}>
            <div>
              <span>Цена</span>
              <strong>
                {new Intl.NumberFormat(
                  "ru-RU"
                ).format(artwork.price)}
                ₽
              </strong>
            </div>

            <div>
              <span>Год</span>
              <strong>
                {artwork.year}
              </strong>
            </div>

            <div>
              <span>Размер</span>
              <strong>
                {artwork.width} ×{" "}
                {artwork.height} см
              </strong>
            </div>

            <div>
              <span>Материал</span>
              <strong>
                {artwork.material}
              </strong>
            </div>
          </div>

          <p className={styles.description}>
            {artwork.description}
          </p>

          <div className={styles.buttons}>
            <button
              className={styles.edit}
              onClick={() =>
                onEdit(artwork)
              }
            >
              Редактировать
            </button>

            <button
              className={styles.delete}
              onClick={() =>
                onDelete(artwork)
              }
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}