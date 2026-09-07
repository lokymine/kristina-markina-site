import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET не найден в .env");
}

const secretKey = new TextEncoder().encode(secret);

export async function verifyAdminCredentials(
  login: string,
  password: string
) {
  const adminLogin = process.env.ADMIN_LOGIN;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminLogin || !adminPasswordHash) {
    throw new Error(
      "ADMIN_LOGIN или ADMIN_PASSWORD_HASH не настроены"
    );
  }

  if (login !== adminLogin) {
    return false;
  }

  return bcrypt.compare(
    password,
    adminPasswordHash
  );
}

export async function createAdminToken() {
  return new SignJWT({
    role: "admin",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAdminToken(
  token: string
) {
  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    return payload.role === "admin";
  } catch {
    return false;
  }
}