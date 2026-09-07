"use client";

import {
  useEffect,
  useState,
} from "react";

type FontAsset = {
  id: number;
  name: string;
  url: string;
};

export default function CustomFonts() {
  const [fonts, setFonts] =
    useState<FontAsset[]>([]);

  useEffect(() => {
    async function loadFonts() {
      try {
        const response =
          await fetch(
            "/api/fonts",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        setFonts(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadFonts();
  }, []);

  if (fonts.length === 0) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: fonts
          .map(
            (font) => `
              @font-face {
                font-family: "${font.name}";
                src: url("${font.url}") format("${font.url.endsWith(".woff2")
                  ? "woff2"
                  : font.url.endsWith(".woff")
                  ? "woff"
                  : "truetype"}");
                font-style: normal;
                font-weight: 400;
                font-display: swap;
              }
            `
          )
          .join("\n"),
      }}
    />
  );
}