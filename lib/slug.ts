import { prisma } from "@/lib/prisma";

const transliteration: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map(
      (char) =>
        transliteration[char] ?? char
    )
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createUniqueSlug(
  title: string,
  excludeId?: number
): Promise<string> {
  const baseSlug =
    slugify(title) ||
    `artwork-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing =
      await prisma.artwork.findUnique({
        where: {
          slug,
        },
      });

    if (
      !existing ||
      existing.id === excludeId
    ) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;

    counter++;
  }
}