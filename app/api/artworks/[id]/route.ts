import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/slug";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/*
 * =========================================
 * ПОЛУЧЕНИЕ ПАРАМЕТРА
 * =========================================
 */

async function getParam(
  context: RouteContext
): Promise<string> {
  const { id } = await context.params;

  return decodeURIComponent(id);
}

/*
 * =========================================
 * ПОИСК КАРТИНЫ
 * =========================================
 *
 * Если параметр числовой:
 *
 * /api/artworks/14
 *
 * ищем по id.
 *
 * Если параметр строковый:
 *
 * /api/artworks/pvapav
 *
 * ищем по slug.
 *
 * В обоих случаях сразу
 * получаем дополнительные фото.
 */

async function findArtwork(
  context: RouteContext
) {
  const param = await getParam(context);

  const numericId = Number(param);

  if (
    Number.isInteger(numericId) &&
    numericId > 0
  ) {
    return prisma.artwork.findUnique({
      where: {
        id: numericId,
      },

      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  return prisma.artwork.findUnique({
    where: {
      slug: param,
    },

    include: {
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

/*
 * =========================================
 * GET
 * =========================================
 *
 * GET /api/artworks/14
 *
 * или
 *
 * GET /api/artworks/pvapav
 */

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const artwork =
      await findArtwork(context);

    if (!artwork) {
      return NextResponse.json(
        {
          error:
            "Картина не найдена",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      artwork
    );
  } catch (error) {
    console.error(
      "GET /api/artworks/[id]:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка загрузки картины",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =========================================
 * PATCH
 * =========================================
 *
 * Редактирование картины.
 *
 * Здесь оставляем работу именно
 * по числовому ID, потому что админка
 * редактирует /api/artworks/14.
 */

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const param = await getParam(
      context
    );

    const artworkId = Number(param);

    if (
      !Number.isInteger(artworkId) ||
      artworkId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректный ID картины",
        },
        {
          status: 400,
        }
      );
    }

    const existingArtwork =
      await prisma.artwork.findUnique({
        where: {
          id: artworkId,
        },
      });

    if (!existingArtwork) {
      return NextResponse.json(
        {
          error:
            "Картина не найдена",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await request.json();

    /*
     * =================================
     * TITLE
     * =================================
     */

    let title =
      existingArtwork.title;

    if (
      typeof body.title ===
      "string"
    ) {
      const newTitle =
        body.title.trim();

      if (!newTitle) {
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

      title = newTitle;
    }

    /*
     * =================================
     * SLUG
     * =================================
     */

    let slug =
      existingArtwork.slug;

    if (
      title !==
      existingArtwork.title
    ) {
      slug =
        await createUniqueSlug(
          title,
          artworkId
        );
    }

    /*
     * =================================
     * DATA
     * =================================
     */

    const data: {
      title?: string;
      slug?: string;
      image?: string;
      year?: number;
      price?: number;
      width?: number;
      height?: number;
      material?: string;
      size?: string;
      description?: string;
      category?: string;
      status?: string;
      order?: number;
    } = {
      title,
      slug,
    };

    /*
     * =================================
     * IMAGE
     * =================================
     */

    if (
      typeof body.image ===
      "string"
    ) {
      const image =
        body.image.trim();

      if (!image) {
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

      data.image = image;
    }

    /*
     * =================================
     * YEAR
     * =================================
     */

    if (
      body.year !==
      undefined
    ) {
      const year =
        Number(body.year);

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

      data.year = year;
    }

    /*
     * =================================
     * PRICE
     * =================================
     */

    if (
      body.price !==
      undefined
    ) {
      const price =
        Number(body.price);

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

      data.price = price;
    }

    /*
     * =================================
     * WIDTH
     * =================================
     */

    if (
      body.width !==
      undefined
    ) {
      const width =
        Number(body.width);

      if (
        !Number.isFinite(width)
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

      data.width = width;
    }

    /*
     * =================================
     * HEIGHT
     * =================================
     */

    if (
      body.height !==
      undefined
    ) {
      const height =
        Number(body.height);

      if (
        !Number.isFinite(height)
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

      data.height = height;
    }

    /*
     * =================================
     * MATERIAL
     * =================================
     */

    if (
      typeof body.material ===
      "string"
    ) {
      data.material =
        body.material.trim();
    }

    /*
     * =================================
     * SIZE
     * =================================
     */

    if (
      typeof body.size ===
      "string"
    ) {
      data.size =
        body.size.trim();
    } else if (
      body.width !==
        undefined ||
      body.height !==
        undefined
    ) {
      const width =
        data.width ??
        existingArtwork.width;

      const height =
        data.height ??
        existingArtwork.height;

      data.size =
        `${width} × ${height} см`;
    }

    /*
     * =================================
     * DESCRIPTION
     * =================================
     */

    if (
      typeof body.description ===
      "string"
    ) {
      data.description =
        body.description.trim();
    }

    /*
     * =================================
     * CATEGORY
     * =================================
     */

    data.category =
      "Живопись";

    /*
     * =================================
     * STATUS
     * =================================
     */

    if (
      typeof body.status ===
      "string"
    ) {
      data.status =
        body.status.trim();
    }

    /*
     * =================================
     * ORDER
     * =================================
     */

    if (
      body.order !==
      undefined
    ) {
      const order =
        Number(body.order);

      if (
        !Number.isFinite(order)
      ) {
        return NextResponse.json(
          {
            error:
              "Некорректный порядок",
          },
          {
            status: 400,
          }
        );
      }

      data.order = order;
    }

    /*
     * =================================
     * UPDATE
     * =================================
     */

    const artwork =
      await prisma.artwork.update({
        where: {
          id: artworkId,
        },

        data,

        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

    return NextResponse.json(
      artwork
    );
  } catch (error) {
    console.error(
      "PATCH /api/artworks/[id]:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка сохранения картины",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =========================================
 * DELETE
 * =========================================
 *
 * DELETE /api/artworks/14
 */

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const param = await getParam(
      context
    );

    const artworkId = Number(param);

    if (
      !Number.isInteger(artworkId) ||
      artworkId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректный ID картины",
        },
        {
          status: 400,
        }
      );
    }

    const artwork =
      await prisma.artwork.findUnique({
        where: {
          id: artworkId,
        },
      });

    if (!artwork) {
      return NextResponse.json(
        {
          error:
            "Картина не найдена",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.artwork.delete({
      where: {
        id: artworkId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/artworks/[id]:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка удаления картины",
      },
      {
        status: 500,
      }
    );
  }
}