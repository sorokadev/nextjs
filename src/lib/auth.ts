import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, type UserRole } from "@/lib/constants";
import { parseRoleCookieValue } from "@/lib/auth-cookie";

export async function getRoleFromCookie(): Promise<UserRole | null> {
  const store = await cookies();
  const raw = store.get(AUTH_COOKIE_NAME)?.value;
  return parseRoleCookieValue(raw);
}

export async function requireAuth(): Promise<UserRole> {
  const role = await getRoleFromCookie();
  if (!role) redirect("/login");
  return role;
}

export async function requireAdmin(): Promise<UserRole> {
  const role = await requireAuth();
  if (role !== "admin") redirect("/forms");
  return role;
}

