import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { queryOne } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "staff";
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function signJWT(
  payload: { sub: string; email: string; role: string },
  options: { exp: string } = { exp: "7d" }
) {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(options.exp)
      .sign(JWT_SECRET);

    return token;
  } catch (error) {
    console.error("JWT signing error:", error);
    throw error;
  }
}

export async function verifyJWT<T>(token: string): Promise<T> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as T;
  } catch (error) {
    console.error("JWT verification error:", error);
    throw error;
  }
}

export async function getSession(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const verified = await verifyJWT<{
      sub: string;
      email: string;
      role: string;
    }>(token);
    return verified;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const verified = await verifyJWT<{
      sub: string;
      email: string;
      role: string;
    }>(token);

    const user = await queryOne<User>(
      "SELECT id, email, name, role FROM users WHERE id = ?",
      [parseInt(verified.sub, 10)]
    );

    return user;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  console.log("[AUTH] Starting login process...");
  console.log("[AUTH] Provided email:", email);

  const user = await queryOne<User & { password_hash: string }>(
    "SELECT id, email, name, role, password_hash FROM users WHERE email = ?",
    [email]
  );

  console.log("[AUTH] DB query result:", user);

  if (!user) {
    console.warn("[AUTH] No user found with that email.");
    throw new Error("Invalid credentials");
  }

  console.log("[AUTH] Stored hash:", user.password_hash);

  const isValid = await verifyPassword(password, user.password_hash);
  console.log("[AUTH] Password match:", isValid);

  if (!isValid) {
    console.warn("[AUTH] Password did not match.");
    throw new Error("Invalid credentials");
  }

  const token = await signJWT({
    sub: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  console.log("[AUTH] JWT created:", token);

  const cookieStore = cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  console.log("[AUTH] Token cookie set.");

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete("token");
}
