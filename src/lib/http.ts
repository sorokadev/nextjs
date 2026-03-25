import { headers } from "next/headers";
import { getEnv } from "@/lib/env";

export async function getBaseUrl() {
  const env = getEnv();
  if (env.APP_URL) return env.APP_URL.replace(/\/$/, "");

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

