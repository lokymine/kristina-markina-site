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
     * IP + конкретная картина + клик
     */

    const key =
      `artwork:click:${artworkId}:${ip}`;

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
     * Если этот IP уже кликал
     * по этой картине менее
     * 12 часов назад —
     * новый клик не считаем.
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
          "Клик по этой картине уже засчитан за последние 12 часов",
      });
    }

    /*
     * Запоминаем клик
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
     * Увеличиваем клики
     * только этой картины
     */

    const stats =
      await prisma.artworkStats.upsert({
        where: {
          artworkId,
        },

        update: {
          clicks: {
            increment: 1,
          },
        },

        create: {
          artworkId,
          views: 0,
          clicks: 1,
        },
      });

    return NextResponse.json({
      success: true,
      counted: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Artwork click statistics error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Не удалось сохранить клик",
      },
      {
        status: 500,
      }
    );
  }
}