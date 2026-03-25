import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { EditFormForm } from "@/components/EditFormForm";
import { requireAdmin } from "@/lib/auth";
import { getBaseUrl } from "@/lib/http";
import type { FormRecord } from "@/lib/forms/schema";

type ApiGetResponse = { item: FormRecord } | { error: string };

export default async function EditFormPage(props: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await props.params;
  const url = new URL(`/api/forms/${id}`, await getBaseUrl());
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) {
    return (
      <AppShell>
        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-xl font-semibold text-zinc-900">Редагування форми</h1>
          <p className="mt-2 text-sm text-rose-600">Не вдалося завантажити форму.</p>
          <p className="mt-1 text-sm text-zinc-600">Спробуйте оновити сторінку.</p>
          <div className="mt-4">
            <Link href="/forms" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
              ← До списку
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const data = (await res.json()) as ApiGetResponse;
  if (!("item" in data)) notFound();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Редагування</h1>
            <p className="mt-1 text-sm text-zinc-600">
              ID: <span className="font-mono text-zinc-900">{data.item._id}</span>
            </p>
          </div>
          <Link href="/forms" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            ← До списку
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <EditFormForm item={data.item} />
        </div>
      </div>
    </AppShell>
  );
}

