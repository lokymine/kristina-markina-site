"use client";

import { Artwork } from "./ArtworkForm";
import styles from "./DeleteModal.module.css";

type Props = {
  artwork: Artwork | null;
  onClose: () => void;
  onDeleted: (id: number) => void;
};

export default function DeleteModal({
  artwork,
  onClose,
  onDeleted,
}: Props) {
  if (!artwork) return null;

  const currentArtwork = artwork;

  async function removeArtwork() {
    const response = await fetch(
      `/api/artworks/${currentArtwork.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("Не удалось удалить картину");
      return;
    }

    onDeleted(currentArtwork.id);
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Удалить картину?</h2>

        <p>
          Вы действительно хотите удалить
          <br />
          <strong>{currentArtwork.title}</strong>?
        </p>

        <div className={styles.imageBox}>
          <img
            src={currentArtwork.image}
            alt={currentArtwork.title}
          />
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.cancel}
            onClick={onClose}
          >
            Отмена
          </button>

          <button
            className={styles.delete}
            onClick={removeArtwork}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}