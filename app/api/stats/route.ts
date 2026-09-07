import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const siteStats =
      await prisma.siteStats.findMany({
        orderBy: {
          date: "desc",
        },
      });

    const artworkStats =
      await prisma.artworkStats.findMany({
        include: {
          artwork: true,
        },

        orderBy: {
          views: "desc",
        },
      });

    const totalVisits =
      siteStats.reduce(
        (sum, item) =>
          sum + item.visits,
        0
      );

    const totalUniqueVisits =
      siteStats.reduce(
        (sum, item) =>
          sum +
          item.uniqueVisits,
        0
      );

    const totalViews =
      artworkStats.reduce(
        (sum, item) =>
          sum + item.views,
        0
      );

    const totalClicks =
      artworkStats.reduce(
        (sum, item) =>
          sum + item.clicks,
        0
      );

    const popularArtwork =
      artworkStats.length > 0
        ? {
            id:
              artworkStats[0]
                .artwork.id,

            title:
              artworkStats[0]
                .artwork.title,

            image:
              artworkStats[0]
                .artwork.image,

            views:
              artworkStats[0]
                .views,

            clicks:
              artworkStats[0]
                .clicks,
          }
        : null;

    return NextResponse.json({
      success: true,

      totals: {
        visits: totalVisits,

        uniqueVisits:
          totalUniqueVisits,

        views: totalViews,

        clicks: totalClicks,
      },

      popularArtwork,

      artworks:
        artworkStats.map(
          (item) => ({
            id:
              item.artwork.id,

            title:
              item.artwork.title,

            image:
              item.artwork.image,

            views:
              item.views,

            clicks:
              item.clicks,
          })
        ),

      daily:
        siteStats.map(
          (item) => ({
            date: item.date,

            visits:
              item.visits,

            uniqueVisits:
              item.uniqueVisits,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Statistics GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Не удалось получить статистику",
      },
      {
        status: 500,
      }
    );
  }
}