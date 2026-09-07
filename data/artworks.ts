import { Artwork } from "@/types/artwork";

export const artworks: Artwork[] = [
  {
    id: 1,
    title: "Утро",
    image: "/images/hero.jpg",
    year: 2025,
    material: "Холст, масло",
    size: "100×80 см",
    width: 100,
    height: 80,
    description: "Описание картины.",
    category: "Живопись",
    status: "sold",
    price: 1000,
  },
  {
    id: 2,
    title: "Название",
    image: "/images/hero.jpg",
    year: 2026,
    material: "Холст, масло",
    size: "80 × 100 см",
    width: 80,
    height: 100,
    description: "Описание картины.",
    category: "Живопись",
    status: "available",
    price: 200,
  }
];