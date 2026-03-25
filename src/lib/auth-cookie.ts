import { z } from "zod";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, type UserRole } from "@/lib/constants";

const RoleCookieSchema = z.enum(["individual", "admin"]);

export function parseRoleCookieValue(value: unknown): UserRole | null {
  const parsed = RoleCookieSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function getRoleFromRequest(req: NextRequest): UserRole | null {
  const raw = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  return parseRoleCookieValue(raw);
}

