import { NextResponse } from "next/server";
import { z } from "zod";
import { getRoleFromCookie } from "@/lib/auth";
import { FormStatusSchema } from "@/lib/forms/schema";
import { createForm, listForms } from "@/lib/forms/repo";

const ListQuerySchema = z.object({
  status: FormStatusSchema.optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const parsed = ListQuerySchema.safeParse({ status });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const forms = await listForms({ status: parsed.data.status });
  return NextResponse.json({ items: forms });
}

export async function POST(req: Request) {
  const role = await getRoleFromCookie();
  if (role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  try {
    const created = await createForm(body);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: e instanceof Error ? e.message : "Invalid payload" },
      { status: 400 }
    );
  }
}

