import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

/* =========================================
   НОРМАЛИЗАЦИЯ ЦВЕТА
========================================= */

function normalizeColor(
  value: unknown,
  fallback: string
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return fallback;
  }

  return value.trim();
}

/* =========================================
   НОРМАЛИЗАЦИЯ ЗАТЕМНЕНИЯ
========================================= */

function normalizeOverlay(
  value: unknown
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(number)
    )
  );
}

/* =========================================
   GET
========================================= */

export async function GET() {
  try {
    let settings =
      await prisma.siteSettings.findUnique({
        where: {
          id: 1,
        },
      });

    if (!settings) {
      settings =
        await prisma.siteSettings.create({
          data: {
            id: 1,
          },
        });
    }

    return NextResponse.json({
      label:
        settings.homeLabel,

      title:
        settings.homeTitle,

      description:
        settings.homeDescription,

      buttonText:
        settings.homeButtonText,

      heroImage:
        settings.heroImage,

      backgroundImage:
        settings.backgroundImage,

      backgroundColor:
        settings.backgroundColor,

      /*
       * Отдельный цвет маленькой надписи
       */
      homeLabelColor:
        settings.homeLabelColor,

      /*
       * Отдельный цвет заголовка
       */
      homeTitleColor:
        settings.homeTitleColor,

      /*
       * Отдельный цвет описания
       */
      homeDescriptionColor:
        settings.homeDescriptionColor,

      /*
       * Цвет кнопки
       */
      homeButtonColor:
        settings.homeButtonColor,

      /*
       * Цвет текста кнопки
       */
      homeButtonTextColor:
        settings.homeButtonTextColor,

      /*
       * Шрифт главной
       */
      homeFontFamily:
        settings.homeFontFamily,

      /*
       * Расположение текста
       */
      homeLayout:
        settings.homeLayout,

      /*
       * Затемнение фона
       */
      backgroundOverlay:
        settings.backgroundOverlay,
    });
  } catch (error) {
    console.error(
      "GET /api/home-settings:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Не удалось загрузить настройки главной страницы",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   PATCH
========================================= */

export async function PATCH(
  request: Request
) {
  try {
    const body =
      await request.json();

    /* =====================================
       РАСПОЛОЖЕНИЕ
    ===================================== */

    const layout =
      body.homeLayout === "center"
        ? "center"
        : body.homeLayout === "right"
        ? "right"
        : "left";

    /* =====================================
       ЦВЕТ МАЛЕНЬКОЙ НАДПИСИ
    ===================================== */

    const homeLabelColor =
      normalizeColor(
        body.homeLabelColor,
        "#292722"
      );

    /* =====================================
       ЦВЕТ ЗАГОЛОВКА
    ===================================== */

    const homeTitleColor =
      normalizeColor(
        body.homeTitleColor,
        "#292722"
      );

    /* =====================================
       ЦВЕТ ОПИСАНИЯ
    ===================================== */

    const homeDescriptionColor =
      normalizeColor(
        body.homeDescriptionColor,
        "#292722"
      );

    /* =====================================
       ЦВЕТ КНОПКИ
    ===================================== */

    const homeButtonColor =
      normalizeColor(
        body.homeButtonColor,
        "#292722"
      );

    /* =====================================
       ЦВЕТ ТЕКСТА КНОПКИ
    ===================================== */

    const homeButtonTextColor =
      normalizeColor(
        body.homeButtonTextColor,
        "#f8f7f3"
      );

    /* =====================================
       ОБЩИЙ ЦВЕТ ТЕКСТА
       
       Оставляем для совместимости
       со старой настройкой.
    ===================================== */

    const homeTextColor =
      normalizeColor(
        body.homeTextColor,
        homeTitleColor
      );

    /* =====================================
       ЦВЕТ ФОНА
    ===================================== */

    const backgroundColor =
      normalizeColor(
        body.backgroundColor,
        "#f8f7f3"
      );

    /* =====================================
       ШРИФТ
    ===================================== */

    const homeFontFamily =
      typeof body.homeFontFamily ===
      "string" &&
      body.homeFontFamily.trim() !== ""
        ? body.homeFontFamily.trim()
        : "Inter";

    /* =====================================
       ЗАТЕМНЕНИЕ
    ===================================== */

    const backgroundOverlay =
      normalizeOverlay(
        body.backgroundOverlay
      );

    /* =====================================
       КАРТИНКА HERO
    ===================================== */

    const heroImage =
      typeof body.heroImage ===
        "string" &&
      body.heroImage.trim() !== ""
        ? body.heroImage.trim()
        : null;

    /* =====================================
       ФОНОВАЯ КАРТИНКА
    ===================================== */

    const backgroundImage =
      typeof body.backgroundImage ===
        "string" &&
      body.backgroundImage.trim() !== ""
        ? body.backgroundImage.trim()
        : null;

    /* =====================================
       СОХРАНЕНИЕ
    ===================================== */

    const settings =
      await prisma.siteSettings.upsert({
        where: {
          id: 1,
        },

        /* =================================
           CREATE
        ================================= */

        create: {
          id: 1,

          homeLabel:
            typeof body.label === "string"
              ? body.label
              : "Художник",

          homeTitle:
            typeof body.title === "string"
              ? body.title
              : "Кристина Маркина",

          homeDescription:
            typeof body.description ===
            "string"
              ? body.description
              : "",

          homeButtonText:
            typeof body.buttonText ===
            "string"
              ? body.buttonText
              : "Смотреть каталог",

          heroImage,

          backgroundImage,

          backgroundColor,

          /*
           * Теперь эти три значения
           * действительно сохраняются.
           */
          homeLabelColor,

          homeTitleColor,

          homeDescriptionColor,

          /*
           * Старое поле оставляем,
           * чтобы ничего не сломать.
           */
          homeTextColor,

          homeButtonColor,

          homeButtonTextColor,

          /*
           * Теперь шрифт тоже сохраняется.
           */
          homeFontFamily,

          homeLayout:
            layout,

          backgroundOverlay,
        },

        /* =================================
           UPDATE
        ================================= */

        update: {
          homeLabel:
            typeof body.label === "string"
              ? body.label
              : "",

          homeTitle:
            typeof body.title === "string"
              ? body.title
              : "",

          homeDescription:
            typeof body.description ===
            "string"
              ? body.description
              : "",

          homeButtonText:
            typeof body.buttonText ===
            "string"
              ? body.buttonText
              : "",

          heroImage,

          backgroundImage,

          backgroundColor,

          /*
           * =================================
           * ВАЖНО
           * =================================
           *
           * Именно эти значения раньше
           * отсутствовали.
           */

          homeLabelColor,

          homeTitleColor,

          homeDescriptionColor,

          homeTextColor,

          homeButtonColor,

          homeButtonTextColor,

          homeFontFamily,

          homeLayout:
            layout,

          backgroundOverlay,
        },
      });

    return NextResponse.json({
      success: true,

      settings,
    });
  } catch (error) {
    console.error(
      "PATCH /api/home-settings:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Не удалось сохранить настройки главной страницы",
      },
      {
        status: 500,
      }
    );
  }
}