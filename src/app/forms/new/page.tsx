import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { NewFormForm } from "@/components/NewFormForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewFormPage() {
  await requireAdmin();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">New form</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Fill in the basics. You can edit details later.
            </p>
          </div>
          <Link href="/forms" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            ← Back to list
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <NewFormForm />
        </div>
      </div>
    </AppShell>
  );
}

