import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/*
 * GET
 * Получить список загруженных шрифтов
 */
export async function GET() {
  try {
    const fonts = await prisma.fontAsset.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(fonts);
  } catch (error) {
    console.error(
      "Ошибка загрузки списка шрифтов:",
      error
    );

    return NextResponse.json(
      {
        error: "Не удалось получить список шрифтов",
      },
      {
        status: 500,
      }
    );
  }
}


/*
 * POST
 * Загрузить новый шрифт
 */
export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Файл не найден",
        },
        {
          status: 400,
        }
      );
    }

    const extension =
      path
        .extname(file.name)
        .toLowerCase();

    const allowedExtensions = [
      ".woff2",
      ".woff",
      ".ttf",
    ];

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Разрешены только WOFF2, WOFF и TTF",
        },
        {
          status: 400,
        }
      );
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            "Размер шрифта не должен превышать 10 МБ",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const originalName =
      path.basename(
        file.name,
        extension
      );

    const safeName =
      originalName
        .replace(
          /[^a-zA-Z0-9а-яА-ЯёЁ_-]/g,
          "-"
        )
        .replace(
          /-+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );

    const fileName =
      `${safeName || "font"}-${Date.now()}${extension}`;

    const fontsDirectory =
      path.join(
        process.cwd(),
        "public",
        "fonts"
      );

    await fs.mkdir(
      fontsDirectory,
      {
        recursive: true,
      }
    );

    const filePath =
      path.join(
        fontsDirectory,
        fileName
      );

    await fs.writeFile(
      filePath,
      buffer
    );

    const fontName =
      originalName || "Custom Font";

    const url =
      `/fonts/${fileName}`;

    const font =
      await prisma.fontAsset.create({
        data: {
          name: fontName,
          url,
        },
      });

    return NextResponse.json(
      font,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Ошибка загрузки шрифта:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Не удалось загрузить шрифт",
      },
      {
        status: 500,
      }
    );
  }
}


/*
 * DELETE
 * Удалить загруженный шрифт
 */
export async function DELETE(
  request: Request
) {
  try {
    const body =
      await request.json();

    const id =
      Number(body?.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Некорректный ID шрифта",
        },
        {
          status: 400,
        }
      );
    }

    const font =
      await prisma.fontAsset.findUnique({
        where: {
          id,
        },
      });

    if (!font) {
      return NextResponse.json(
        {
          error:
            "Шрифт не найден",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * URL имеет вид:
     *
     * /fonts/example-123456.woff2
     *
     * Получаем только имя файла.
     */
    const fileName =
      path.basename(font.url);

    const filePath =
      path.join(
        process.cwd(),
        "public",
        "fonts",
        fileName
      );

    /*
     * Сначала удаляем файл.
     *
     * Если файла уже нет —
     * это не ошибка.
     */
    try {
      await fs.unlink(
        filePath
      );
    } catch (fileError) {
      const errorCode =
        fileError as NodeJS.ErrnoException;

      if (
        errorCode.code !==
        "ENOENT"
      ) {
        throw fileError;
      }
    }

    /*
     * Затем удаляем запись
     * из базы данных.
     */
    await prisma.fontAsset.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Ошибка удаления шрифта:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Не удалось удалить шрифт",
      },
      {
        status: 500,
      }
    );
  }
}