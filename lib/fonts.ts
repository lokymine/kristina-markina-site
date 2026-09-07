export const AVAILABLE_FONTS = [
  {
    value: "Inter",
    label: "Inter",
    css: "Inter, sans-serif",
  },
  {
    value: "Arial",
    label: "Arial",
    css: "Arial, sans-serif",
  },
  {
    value: "Georgia",
    label: "Georgia",
    css: "Georgia, serif",
  },
  {
    value: "Times New Roman",
    label: "Times New Roman",
    css: '"Times New Roman", serif',
  },
  {
    value: "Verdana",
    label: "Verdana",
    css: "Verdana, sans-serif",
  },
  {
    value: "Trebuchet MS",
    label: "Trebuchet MS",
    css: '"Trebuchet MS", sans-serif',
  },
  {
    value: "Courier New",
    label: "Courier New",
    css: '"Courier New", monospace',
  },
];

export function getFontFamily(
  fontName: string | null | undefined
) {
  if (!fontName) {
    return "Inter, sans-serif";
  }

  const font = AVAILABLE_FONTS.find(
    (item) => item.value === fontName
  );

  if (font) {
    return font.css;
  }

  /*
   * Если шрифт не входит в стандартный список,
   * значит это загруженный пользователем шрифт.
   */
  return `"${fontName}", sans-serif`;
}