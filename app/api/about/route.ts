import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const about = await prisma.about.upsert({
      where: {
        id: 1,
      },

      update: {},

      create: {
        id: 1,
        title: "О художнике",
        description: "",
        image: null,
      },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error("ABOUT GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Ошибка загрузки информации",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const about = await prisma.about.upsert({
      where: {
        id: 1,
      },

      update: {
        title:
          typeof body.title === "string"
            ? body.title
            : "",

        description:
          typeof body.description === "string"
            ? body.description
            : "",

        image:
          typeof body.image === "string" &&
          body.image.length > 0
            ? body.image
            : null,

        titleColor:
          typeof body.titleColor === "string"
            ? body.titleColor
            : "#292722",

        descriptionColor:
          typeof body.descriptionColor === "string"
            ? body.descriptionColor
            : "#5f5b54",

        fontFamily:
          typeof body.fontFamily === "string"
            ? body.fontFamily
            : "Inter",
      },

      create: {
        id: 1,

        title:
          typeof body.title === "string"
            ? body.title
            : "О художнике",

        description:
          typeof body.description === "string"
            ? body.description
            : "",

        image:
          typeof body.image === "string" &&
          body.image.length > 0
            ? body.image
            : null,

        titleColor:
          typeof body.titleColor === "string"
            ? body.titleColor
            : "#292722",

        descriptionColor:
          typeof body.descriptionColor === "string"
            ? body.descriptionColor
            : "#5f5b54",

        fontFamily:
          typeof body.fontFamily === "string"
            ? body.fontFamily
            : "Inter",
      },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error("ABOUT PATCH ERROR:", error);

    return NextResponse.json(
      {
        error: "Ошибка сохранения",
      },
      {
        status: 500,
      }
    );
  }
}