import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

type BulkDeleteBody = {
  ids: number[];
};

export async function DELETE(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as BulkDeleteBody;

    if (
      !body ||
      !Array.isArray(body.ids)
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректный список картин",
        },
        {
          status: 400,
        }
      );
    }

    const ids = body.ids
      .map((id) => Number(id))
      .filter(
        (id) =>
          Number.isInteger(id) &&
          id > 0
      );

    if (ids.length === 0) {
      return NextResponse.json(
        {
          error:
            "Нет выбранных картин",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.artwork.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/artworks/bulk-delete:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ошибка удаления картин",
      },
      {
        status: 500,
      }
    );
  }
}