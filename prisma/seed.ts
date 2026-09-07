import { PrismaClient } from "@prisma/client";
import { artworks } from "../data/artworks";

const prisma = new PrismaClient();

function createSlug(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/ё/g, "e")
    .replace(/[^a-zа-я0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${slug || "artwork"}-${id}`;
}

async function main() {
  console.log("Начинаем перенос картин...");

  for (const artwork of artworks) {
    const slug = createSlug(
      artwork.title,
      artwork.id
    );

    await prisma.artwork.upsert({
      where: {
        id: artwork.id,
      },

      update: {
        title: artwork.title,
        slug,
        image: artwork.image,
        year: artwork.year,
        material: artwork.material,
        size: artwork.size,
        width: artwork.width,
        height: artwork.height,
        price: artwork.price,
        description: artwork.description,
        category: artwork.category,
        status: artwork.status,
      },

      create: {
        id: artwork.id,
        title: artwork.title,
        slug,
        image: artwork.image,
        year: artwork.year,
        material: artwork.material,
        size: artwork.size,
        width: artwork.width,
        height: artwork.height,
        price: artwork.price,
        description: artwork.description,
        category: artwork.category,
        status: artwork.status,
      },
    });
  }

  console.log(
    `Перенесено картин: ${artworks.length}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });