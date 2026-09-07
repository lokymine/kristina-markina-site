import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contacts.upsert({
      where: {
        id: 1,
      },

      update: {},

      create: {
        id: 1,

        phone: null,
        email: null,
        telegram: null,
        vk: null,
        whatsapp: null,
        instagram: null,

        fontFamily: "Inter",
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error(
      "CONTACTS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Ошибка загрузки контактов",
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

    const contacts = await prisma.contacts.upsert({
      where: {
        id: 1,
      },

      update: {
        phone:
          typeof body.phone === "string"
            ? body.phone
            : null,

        email:
          typeof body.email === "string"
            ? body.email
            : null,

        telegram:
          typeof body.telegram === "string"
            ? body.telegram
            : null,

        vk:
          typeof body.vk === "string"
            ? body.vk
            : null,

        whatsapp:
          typeof body.whatsapp === "string"
            ? body.whatsapp
            : null,

        instagram:
          typeof body.instagram === "string"
            ? body.instagram
            : null,

        fontFamily:
          typeof body.fontFamily === "string"
            ? body.fontFamily
            : "Inter",
      },

      create: {
        id: 1,

        phone:
          typeof body.phone === "string"
            ? body.phone
            : null,

        email:
          typeof body.email === "string"
            ? body.email
            : null,

        telegram:
          typeof body.telegram === "string"
            ? body.telegram
            : null,

        vk:
          typeof body.vk === "string"
            ? body.vk
            : null,

        whatsapp:
          typeof body.whatsapp === "string"
            ? body.whatsapp
            : null,

        instagram:
          typeof body.instagram === "string"
            ? body.instagram
            : null,

        fontFamily:
          typeof body.fontFamily === "string"
            ? body.fontFamily
            : "Inter",
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error(
      "CONTACTS PATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Ошибка сохранения контактов",
      },
      {
        status: 500,
      }
    );
  }
}