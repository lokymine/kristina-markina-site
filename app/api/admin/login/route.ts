import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json();

    const adminLogin = process.env.ADMIN_LOGIN;

    const encodedHash = process.env.ADMIN_PASSWORD_HASH_B64;

    
    if (!adminLogin || !encodedHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Не настроены переменные окружения",
        },
        {
          status: 500,
        }
      );
    }

    const adminPasswordHash = Buffer.from(
      encodedHash,
      "base64"
    ).toString("utf8");

    if (login !== adminLogin) {
      return NextResponse.json(
        {
          success: false,
          message: "Неверный логин или пароль",
        },
        {
          status: 401,
        }
      );
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      adminPasswordHash
    );

    if (!passwordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Неверный логин или пароль",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка сервера",
      },
      {
        status: 500,
      }
    );
  }
}