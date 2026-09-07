"use client";

import { useEffect } from "react";

export default function SiteVisitTracker() {
  useEffect(() => {
    fetch(
      "/api/stats/visit",
      {
        method: "POST",
      }
    ).catch((error) => {
      console.error(
        "Ошибка статистики посещения:",
        error
      );
    });
  }, []);

  return null;
}