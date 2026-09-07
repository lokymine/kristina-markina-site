import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/slug";

const PAGE_SIZE = 20;

type SortOption =
  | "newest"
  | "oldest"
  | "priceAsc"
  | "priceDesc";

function getSort(
  sort: SortOption
) {
  switch (sort) {
    case "oldest":
      return [
        {
          year: "asc" as const,
        },
        {
          createdAt: "asc" as const,
        },
      ];

    case "priceAsc":
      return [
        {
          price: "asc" as const,
        },
        {
          createdAt: "desc" as const,
        },
      ];

    case "priceDesc":
      return [
        {
          price: "desc" as const,
        },
        {
          createdAt: "desc" as const,
        },
      ];

    case "newest":
    default:
      return [
        {
          year: "desc" as const,
        },
        {
          createdAt: "desc" as const,
        },
      ];
  }
}

/*
 * ==========================================
 * GET
 * ==========================================
 *
 * /api/artworks
 *
 * Публичный каталог.
 *
 * /api/artworks?admin=true
 *
 * Админка.
 */

export async function GET(
  request: Request
) {
  try {
    const url = new URL(
      request.url
    );

    const searchParams =
      url.searchParams;

    const isAdmin =
      searchParams.get("admin") ===
      "true";

    /*
     * ==========================================
     * СОРТИРОВКА
     * ==========================================
     */

    const sortParam =
      searchParams.get("sort");

    const sort: SortOption =
      sortParam === "oldest" ||
      sortParam === "priceAsc" ||
      sortParam === "priceDesc" ||
      sortParam === "newest"
        ? sortParam
        : "newest";

    /*
     * ==========================================
     * ФИЛЬТРЫ
     * ==========================================
     */

    const minWidthParam =
      searchParams.get(
        "minWidth"
      );

    const maxWidthParam =
      searchParams.get(
        "maxWidth"
      );

    const minHeightParam =
      searchParams.get(
        "minHeight"
      );

    const maxHeightParam =
      searchParams.get(
        "maxHeight"
      );

    const minWidth =
      minWidthParam !== null &&
      minWidthParam !== ""
        ? Number(minWidthParam)
        : null;

    const maxWidth =
      maxWidthParam !== null &&
      maxWidthParam !== ""
        ? Number(maxWidthParam)
        : null;

    const minHeight =
      minHeightParam !== null &&
      minHeightParam !== ""
        ? Number(minHeightParam)
        : null;

    const maxHeight =
      maxHeightParam !== null &&
      maxHeightParam !== ""
        ? Number(maxHeightParam)
        : null;

    /*
     * ==========================================
     * WHERE
     * ==========================================
     */

    const where: {
      width?: {
        gte?: number;
        lte?: number;
      };

      height?: {
        gte?: number;
        lte?: number;
      };
    } = {};

    if (
      minWidth !== null &&
      Number.isFinite(minWidth)
    ) {
      where.width = {
        ...where.width,
        gte: minWidth,
      };
    }

    if (
      maxWidth !== null &&
      Number.isFinite(maxWidth)
    ) {
      where.width = {
        ...where.width,
        lte: maxWidth,
      };
    }

    if (
      minHeight !== null &&
      Number.isFinite(minHeight)
    ) {
      where.height = {
        ...where.height,
        gte: minHeight,
      };
    }

    if (
      maxHeight !== null &&
      Number.isFinite(maxHeight)
    ) {
      where.height = {
        ...where.height,
        lte: maxHeight,
      };
    }

    /*
     * ==========================================
     * DEBUG
     * ==========================================
     */

    console.log(
      "=========================================="
    );

    console.log(
      "GET /api/artworks"
    );

    console.log(
      "ADMIN:",
      isAdmin
    );

    console.log(
      "WHERE:",
      where
    );

    console.log(
      "SORT:",
      sort
    );

    /*
     * ==========================================
     * АДМИНКА
     * ==========================================
     *
     * Админка получает абсолютно все картины.
     */

    if (isAdmin) {
      const artworks =
        await prisma.artwork.findMany({
          orderBy: [
            {
              order: "asc",
            },
            {
              createdAt: "desc",
            },
          ],
        });

      console.log(
        "ADMIN ARTWORKS COUNT:",
        artworks.length
      );

      return NextResponse.json({
        artworks,

        pagination: {
          page: 1,

          pageSize:
            artworks.length,

          total:
            artworks.length,

          totalPages:
            artworks.length > 0
              ? 1
              : 0,

          hasPreviousPage:
            false,

          hasNextPage:
            false,
        },
      });
    }

    /*
     * ==========================================
     * ПУБЛИЧНЫЙ КАТАЛОГ
     * ==========================================
     *
     * Получаем картины из базы.
     */

    const total =
      await prisma.artwork.count({
        where,
      });

    console.log(
      "PUBLIC ARTWORKS TOTAL:",
      total
    );

    /*
     * ==========================================
     * СТРАНИЦА
     * ==========================================
     */

    const requestedPage =
      Number(
        searchParams.get(
          "page"
        ) || "1"
      );

    const page =
      Number.isFinite(
        requestedPage
      ) &&
      requestedPage > 0
        ? Math.floor(
            requestedPage
          )
        : 1;

    const totalPages =
      Math.ceil(
        total / PAGE_SIZE
      );

    const safePage =
      totalPages > 0
        ? Math.min(
            page,
            totalPages
          )
        : 1;

    const skip =
      (safePage - 1) *
      PAGE_SIZE;

    /*
     * ==========================================
     * КАРТИНЫ
     * ==========================================
     */

    const artworks =
      await prisma.artwork.findMany({
        where,

        skip,

        take: PAGE_SIZE,

        orderBy:
          getSort(sort),
      });

    console.log(
      "PUBLIC ARTWORKS COUNT:",
      artworks.length
    );

    console.log(
      "PUBLIC ARTWORK IDS:",
      artworks.map(
        (artwork) =>
          artwork.id
      )
    );

    console.log(
      "=========================================="
    );

    return NextResponse.json({
      artworks,

      pagination: {
        page: safePage,

        pageSize:
          PAGE_SIZE,

        total,

        totalPages,

        hasPreviousPage:
          safePage > 1,

        hasNextPage:
          safePage <
          totalPages,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/artworks ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка загрузки картин",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ==========================================
 * POST
 * ==========================================
 *
 * Создание картины.
 */

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    /*
     * ==========================================
     * НАЗВАНИЕ
     * ==========================================
     */

    if (
      typeof body.title !==
        "string" ||
      !body.title.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Название картины обязательно",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * ИЗОБРАЖЕНИЕ
     * ==========================================
     */

    if (
      typeof body.image !==
        "string" ||
      !body.image.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Изображение обязательно",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * SLUG
     * ==========================================
     */

    const slug =
      await createUniqueSlug(
        body.title
      );

    /*
     * ==========================================
     * ЧИСЛОВЫЕ ЗНАЧЕНИЯ
     * ==========================================
     */

    const year =
      Number(body.year);

    const price =
      Number(body.price);

    const width =
      Number(body.width);

    const height =
      Number(body.height);

    /*
     * ==========================================
     * ПРОВЕРКИ
     * ==========================================
     */

    if (
      !Number.isFinite(year)
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректный год",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(price)
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректная цена",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(width) ||
      width <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректная ширина",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(height) ||
      height <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректная высота",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * СОЗДАНИЕ
     * ==========================================
     */

    const artwork =
      await prisma.artwork.create({
        data: {
          title:
            body.title.trim(),

          slug,

          image:
            body.image.trim(),

          year,

          price,

          width,

          height,

          material:
            typeof body.material ===
            "string"
              ? body.material.trim()
              : "",

          size:
            typeof body.size ===
              "string" &&
            body.size.trim()
              ? body.size.trim()
              : `${width} × ${height} см`,

          description:
            typeof body.description ===
            "string"
              ? body.description.trim()
              : "",

          category:
            "Живопись",

          status:
            typeof body.status ===
              "string" &&
            body.status.trim()
              ? body.status.trim()
              : "available",
        },
      });

    console.log(
      "ARTWORK CREATED:",
      artwork.id
    );

    return NextResponse.json(
      artwork,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/artworks ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка создания картины",
      },
      {
        status: 500,
      }
    );
  }
}