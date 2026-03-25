import { NextResponse } from "next/server";
import { getRoleFromCookie } from "@/lib/auth";

export async function GET() {
  const role = await getRoleFromCookie();
  return NextResponse.json({ role });
}

