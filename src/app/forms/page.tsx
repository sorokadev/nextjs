import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireAuth } from "@/lib/auth";
import { getBaseUrl } from "@/lib/http";
import type { FormRecord, FormStatus } from "@/lib/forms/schema";

type ApiListResponse = { items: FormRecord[] };

function badge(status: FormStatus) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  if (status === "active") return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  if (status === "draft") return `${base} border-amber-200 bg-amber-50 text-amber-700`;
  return `${base} border-zinc-200 bg-zinc-50 text-zinc-700`;
}

function fmt(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function FormsPage(props: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const role = await requireAuth();
  const sp = (await props.searchParams) ?? {};
  const status = sp.status as FormStatus | undefined;

  const url = new URL("/api/forms", await getBaseUrl());
  if (status) url.searchParams.set("status", status);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return (
      <AppShell>
        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-xl font-semibold text-zinc-900">Forms</h1>
          <p className="mt-2 text-sm text-rose-600">Failed to load the forms list.</p>
          <p className="mt-1 text-sm text-zinc-600">
            Try refreshing the page or check your database connection.
          </p>
        </div>
      </AppShell>
    );
  }

  const data = (await res.json()) as ApiListResponse;
  const items = data.items ?? [];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Forms</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Sort: by last updated (desc). Filter: by status.
            </p>
          </div>
          {role === "admin" ? (
            <Link
              href="/forms/new"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            >
              New form
            </Link>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/forms"
            className={[
              "rounded-full border px-3 py-1.5 text-sm",
              !status ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white",
            ].join(" ")}
          >
            All
          </Link>
          {(["draft", "active", "archived"] as const).map((s) => (
            <Link
              key={s}
              href={`/forms?status=${s}`}
              className={[
                "rounded-full border px-3 py-1.5 text-sm",
                status === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white",
              ].join(" ")}
            >
              {s}
            </Link>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="grid grid-cols-12 gap-4 border-b bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600">
            <div className="col-span-6">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Fields</div>
            <div className="col-span-2">Updated</div>
          </div>

          {items.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-zinc-600">No results for this filter.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((f) => (
                <li key={f._id} className="px-4 py-4">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-6 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-zinc-900">
                          {f.title}
                        </span>
                        {role === "admin" ? (
                          <Link
                            href={`/forms/${f._id}`}
                            className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                          >
                            Edit
                          </Link>
                        ) : null}
                      </div>
                      {f.description ? (
                        <p className="mt-1 line-clamp-1 text-sm text-zinc-600">{f.description}</p>
                      ) : (
                        <p className="mt-1 text-sm text-zinc-400">No description</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className={badge(f.status)}>{f.status}</span>
                    </div>
                    <div className="col-span-2 text-sm text-zinc-700">{f.fieldsCount}</div>
                    <div className="col-span-2 text-sm text-zinc-700">{fmt(f.updatedAt)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

