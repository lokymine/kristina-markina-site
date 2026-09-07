import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

type ReorderArtwork = {
  id: number;
  order: number;
};

type ReorderBody = {
  artworks: ReorderArtwork[];
};

export async function PATCH(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as ReorderBody;

    if (
      !body ||
      !Array.isArray(body.artworks)
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректные данные для изменения порядка",
        },
        {
          status: 400,
        }
      );
    }

    if (
      body.artworks.length === 0
    ) {
      return NextResponse.json({
        success: true,
      });
    }

    await prisma.$transaction(
      body.artworks.map(
        (
          artwork: ReorderArtwork
        ) =>
          prisma.artwork.update({
            where: {
              id: artwork.id,
            },

            data: {
              order: artwork.order,
            },
          })
      )
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "PATCH /api/artworks/reorder:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Не удалось сохранить порядок",
      },
      {
        status: 500,
      }
    );
  }
}