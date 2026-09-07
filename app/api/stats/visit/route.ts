import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const LIMIT_HOURS = 12;

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
  request: Request
) {
  try {
    const ip =
      getClientIp(request);

    const key =
      `site:visit:${ip}`;

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
     * Если этот IP уже заходил
     * менее 12 часов назад,
     * новое посещение не считаем.
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
          "Посещение уже засчитано за последние 12 часов",
      });
    }

    /*
     * Запоминаем посещение
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
     * Определяем начало текущего дня
     */

    const startOfDay =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    /*
     * Добавляем одно посещение
     */

    const stats =
      await prisma.siteStats.upsert({
        where: {
          date: startOfDay,
        },

        update: {
          visits: {
            increment: 1,
          },
        },

        create: {
          date: startOfDay,
          visits: 1,
          uniqueVisits: 0,
        },
      });

    return NextResponse.json({
      success: true,
      counted: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Visit statistics error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Не удалось сохранить посещение",
      },
      {
        status: 500,
      }
    );
  }
}