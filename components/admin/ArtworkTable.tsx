"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import styles from "./ArtworkTable.module.css";

import { Artwork } from "./ArtworkForm";

import SortableArtworkRow from "./SortableArtworkRow";

type Props = {
  artworks: Artwork[];

  selected: number[];

  onToggle: (id: number) => void;

  onToggleAll: () => void;

  onPreview: (
    artwork: Artwork
  ) => void;

  onEdit: (
    artwork: Artwork
  ) => void;

  onDelete: (
    artwork: Artwork
  ) => void;

  onReorder: (
    artworks: Artwork[]
  ) => void;
};

export default function ArtworkTable({
  artworks,
  selected,
  onToggle,
  onToggleAll,
  onPreview,
  onEdit,
  onDelete,
  onReorder,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    const oldIndex =
      artworks.findIndex(
        (a) => a.id === active.id
      );

    const newIndex =
      artworks.findIndex(
        (a) => a.id === over.id
      );

    const newArtworks =
      arrayMove(
        artworks,
        oldIndex,
        newIndex
      );

    onReorder(newArtworks);

    await fetch(
      "/api/artworks/reorder",
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          artworks:
            newArtworks.map(
              (artwork, index) => ({
                id: artwork.id,
                order: index + 1,
              })
            ),
        }),
      }
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={
        closestCenter
      }
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={artworks.map(
          (a) => a.id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        <div className={styles.wrapper}>
          <table
            className={styles.table}
          >
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      artworks.length > 0 &&
                      selected.length ===
                        artworks.length
                    }
                    onChange={
                      onToggleAll
                    }
                  />
                </th>

                <th></th>

                <th>Фото</th>

                <th>Название</th>

                <th>Цена</th>

                <th>Размер</th>

                <th>Год</th>

                <th>Статус</th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {artworks.map(
                (artwork) => (
                  <SortableArtworkRow
                    key={
                      artwork.id
                    }
                    artwork={
                      artwork
                    }
                    selected={
                      selected
                    }
                    onToggle={
                      onToggle
                    }
                    onPreview={
                      onPreview
                    }
                    onEdit={
                      onEdit
                    }
                    onDelete={
                      onDelete
                    }
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      </SortableContext>
    </DndContext>
  );
}