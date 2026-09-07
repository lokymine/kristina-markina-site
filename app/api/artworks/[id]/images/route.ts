import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getArtworkId(
  context: RouteContext
): Promise<number | null> {
  const { id } = await context.params;

  const artworkId = Number(id);

  if (
    !Number.isInteger(artworkId) ||
    artworkId <= 0
  ) {
    return null;
  }

  return artworkId;
}

/*
 * =================================
 * GET
 * =================================
 */

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const artworkId =
      await getArtworkId(context);

    if (artworkId === null) {
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

    const images =
      await prisma.artworkImage.findMany({
        where: {
          artworkId,
        },
        orderBy: {
          order: "asc",
        },
      });

    return NextResponse.json({
      images,
    });
  } catch (error) {
    console.error(
      "GET /api/artworks/[id]/images:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка загрузки дополнительных фотографий",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =================================
 * POST
 * =================================
 */

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const artworkId =
      await getArtworkId(context);

    if (artworkId === null) {
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

    const body =
      await request.json();

    if (
      typeof body.image !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Необходимо указать изображение",
        },
        {
          status: 400,
        }
      );
    }

    const image =
      body.image.trim();

    if (!image) {
      return NextResponse.json(
        {
          error:
            "URL изображения не может быть пустым",
        },
        {
          status: 400,
        }
      );
    }

    const lastImage =
      await prisma.artworkImage.findFirst({
        where: {
          artworkId,
        },
        orderBy: {
          order: "desc",
        },
      });

    const order =
      lastImage
        ? lastImage.order + 1
        : 0;

    const artworkImage =
      await prisma.artworkImage.create({
        data: {
          artworkId,
          image,
          order,
        },
      });

    return NextResponse.json(
      artworkImage,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/artworks/[id]/images:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка добавления фотографии",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =================================
 * DELETE
 * =================================
 */

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const artworkId =
      await getArtworkId(context);

    if (artworkId === null) {
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

    const imageId =
      Number(
        request.nextUrl.searchParams.get(
          "imageId"
        )
      );

    if (
      !Number.isInteger(imageId) ||
      imageId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректный ID фотографии",
        },
        {
          status: 400,
        }
      );
    }

    const image =
      await prisma.artworkImage.findFirst({
        where: {
          id: imageId,
          artworkId,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          error:
            "Фотография не найдена",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.artworkImage.delete({
      where: {
        id: imageId,
      },
    });

    const remainingImages =
      await prisma.artworkImage.findMany({
        where: {
          artworkId,
        },
        orderBy: {
          order: "asc",
        },
      });

    await prisma.$transaction(
      remainingImages.map(
        (item, index) =>
          prisma.artworkImage.update({
            where: {
              id: item.id,
            },
            data: {
              order: index,
            },
          })
      )
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/artworks/[id]/images:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка удаления фотографии",
      },
      {
        status: 500,
      }
    );
  }
}