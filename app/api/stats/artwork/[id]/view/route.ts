import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const LIMIT_HOURS = 12;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function getClientIp(request: Request) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export async function POST(
  request: Request,
  { params }: Props
) {
  try {
    const { id } =
      await params;

    const artworkId =
      Number(id);

    if (
      !Number.isInteger(
        artworkId
      )
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

    const ip =
      getClientIp(request);

    /*
     * Ключ уникален для:
     *
     * IP + конкретная картина + просмотр
     */

    const key =
      `artwork:view:${artworkId}:${ip}`;

    const now =
      new Date();

    const limitTime =
      new Date(
        now.getTime() -
          LIMIT_HOURS *
            60 *
            60 *
            1000
      );

    const existing =
      await prisma.statsVisitor.findUnique({
        where: {
          key,
        },
      });

    /*
     * Повторный просмотр
     * этой же картины
     * в течение 12 часов
     * не считаем.
     */

    if (
      existing &&
      existing.lastAt >
        limitTime
    ) {
      return NextResponse.json({
        success: true,
        counted: false,
        reason:
          "Просмотр этой картины уже засчитан за последние 12 часов",
      });
    }

    /*
     * Запоминаем просмотр
     */

    await prisma.statsVisitor.upsert({
      where: {
        key,
      },

      update: {
        lastAt: now,
      },

      create: {
        key,
        lastAt: now,
      },
    });

    /*
     * Увеличиваем просмотры
     * только этой картины
     */

    const stats =
      await prisma.artworkStats.upsert({
        where: {
          artworkId,
        },

        update: {
          views: {
            increment: 1,
          },
        },

        create: {
          artworkId,
          views: 1,
          clicks: 0,
        },
      });

    return NextResponse.json({
      success: true,
      counted: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Artwork view statistics error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Не удалось сохранить просмотр",
      },
      {
        status: 500,
      }
    );
  }
}