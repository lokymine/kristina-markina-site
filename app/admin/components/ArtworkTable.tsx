"use client";

type Artwork = {
  id: number;
  title: string;
  image: string;
  year: number;
  material: string;
  width: number;
  height: number;
  price: number;
  description: string;
  category: string;
  status: "available" | "sold";
};

type ArtworkTableProps = {
  artworks: Artwork[];
  onEdit: (artwork: Artwork) => void;
  onDelete: (id: number) => void;
  onStatusChange: (
    id: number,
    status: "available" | "sold"
  ) => void;
};

export default function ArtworkTable({
  artworks,
  onEdit,
  onDelete,
  onStatusChange,
}: ArtworkTableProps) {
  if (artworks.length === 0) {
    return (
      <div className="artwork-empty">
        <h2>Картин пока нет</h2>

        <p>
          Добавьте первую картину в каталог.
        </p>
      </div>
    );
  }

  return (
    <div className="artwork-table-wrapper">
      <div className="artwork-table">
        <div className="table-header">
          <div>Картина</div>
          <div>Размер</div>
          <div>Год</div>
          <div>Цена</div>
          <div>Статус</div>
          <div>Действия</div>
        </div>

        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="table-row"
          >
            <div className="table-artwork">
              <div className="table-image">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                />
              </div>

              <div>
                <strong>
                  {artwork.title}
                </strong>

                <span>
                  {artwork.material}
                </span>
              </div>
            </div>

            <div>
              {artwork.width} ×{" "}
              {artwork.height} см
            </div>

            <div>
              {artwork.year}
            </div>

            <div>
              {artwork.price.toLocaleString(
                "ru-RU"
              )}{" "}
              ₽
            </div>

            <div>
              <select
                value={artwork.status}
                onChange={(e) =>
                  onStatusChange(
                    artwork.id,
                    e.target.value as
                      | "available"
                      | "sold"
                  )
                }
                className={
                  artwork.status === "sold"
                    ? "status-sold"
                    : "status-available"
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

            <div className="table-actions">
              <button
                type="button"
                onClick={() =>
                  onEdit(artwork)
                }
              >
                Редактировать
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(artwork.id)
                }
                className="delete-button"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}