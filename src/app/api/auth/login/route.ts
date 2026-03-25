import { NextResponse } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE_NAME, USER_ROLES, type UserRole } from "@/lib/constants";

const LoginSchema = z.object({
  email: z.string().email(),
  role: z.enum(USER_ROLES),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const role: UserRole = parsed.data.role;

  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(AUTH_COOKIE_NAME, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}

