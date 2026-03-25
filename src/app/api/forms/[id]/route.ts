import { NextResponse } from "next/server";
import { getRoleFromCookie } from "@/lib/auth";
import { deleteForm, getFormById, updateForm } from "@/lib/forms/repo";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const item = await getFormById(id);
  if (!item) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const role = await getRoleFromCookie();
  if (role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  try {
    const updated = await updateForm(id, body);
    if (!updated) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ item: updated });
  } catch (e) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: e instanceof Error ? e.message : "Invalid payload" },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const role = await getRoleFromCookie();
  if (role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const ok = await deleteForm(id);
  if (!ok) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

