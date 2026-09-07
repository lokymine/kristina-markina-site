"use client";

import {
    useSortable,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";

import styles from "./ArtworkTable.module.css";

import {
    Artwork,
} from "./ArtworkForm";



type Props = {
    artwork: Artwork;

    selected: number[];

    onToggle: (id: number) => void;

    onPreview: (
        artwork: Artwork
    ) => void;

    onEdit: (
        artwork: Artwork
    ) => void;

    onDelete: (
        artwork: Artwork
    ) => void;
};

export default function SortableArtworkRow({
    artwork,
    selected,
    onToggle,
    onPreview,
    onEdit,
    onDelete,
}: Props) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: artwork.id,
    });

    const style = {
        transform:
            CSS.Transform.toString(
                transform
            ),

        transition,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`${styles.row} ${
                isDragging ? styles.dragging : ""
            }`}
        >
            <td>
                <input
                    type="checkbox"
                    checked={selected.includes(
                        artwork.id
                    )}
                    onChange={() =>
                        onToggle(
                            artwork.id
                        )
                    }
                />
            </td>

            <td
                {...attributes}
                {...listeners}
                className={
                    styles.drag
                }
            >
                ☰
            </td>

            <td>
                <img
                    src={artwork.image}
                    className={
                        styles.image
                    }
                    onClick={() =>
                        onPreview(
                            artwork
                        )
                    }
                />
            </td>

            <td>
                {artwork.title}
            </td>

            <td>
                {artwork.price.toLocaleString(
                    "ru-RU"
                )} ₽
            </td>

            <td>
                {artwork.width} ×{" "}
                {artwork.height}
            </td>

            <td>
                {artwork.year}
            </td>

            <td>
                <span
                    className={
                        artwork.status ===
                        "sold"
                            ? styles.sold
                            : styles.available
                    }
                >
                    {artwork.status ===
                    "sold"
                        ? "Продано"
                        : "В наличии"}
                </span>
            </td>

            <td>
                <button
                    className={
                        styles.edit
                    }
                    onClick={() =>
                        onEdit(
                            artwork
                        )
                    }
                >
                    ✏
                </button>

                <button
                    className={
                        styles.delete
                    }
                    onClick={() =>
                        onDelete(
                            artwork
                        )
                    }
                >
                    🗑
                </button>
            </td>
        </tr>
    );
}