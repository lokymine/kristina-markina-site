"use client";

import { useEffect } from "react";

type Props = {
  artworkId: number;
};

export default function ArtworkViewTracker({
  artworkId,
}: Props) {
  useEffect(() => {
    fetch(
      `/api/stats/artwork/${artworkId}/view`,
      {
        method: "POST",
      }
    ).catch((error) => {
      console.error(
        "Ошибка статистики просмотра:",
        error
      );
    });
  }, [artworkId]);

  return null;
}