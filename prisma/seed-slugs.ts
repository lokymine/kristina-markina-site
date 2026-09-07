import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => transliteration[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const artworks = await prisma.artwork.findMany({
    orderBy: {
      id: "asc",
    },
  });

  for (const artwork of artworks) {
    const baseSlug = slugify(artwork.title);

    let slug = baseSlug;

    const existing = await prisma.artwork.findFirst({
      where: {
        slug,
        NOT: {
          id: artwork.id,
        },
      },
    });

    if (existing) {
      slug = `${baseSlug}-${artwork.id}`;
    }

    await prisma.artwork.update({
      where: {
        id: artwork.id,
      },
      data: {
        slug,
      },
    });

    console.log(
      `${artwork.title} → ${slug}`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });