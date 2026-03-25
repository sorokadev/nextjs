import { AppShell } from "@/components/AppShell";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const role = await requireAuth();

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">
        You are signed in. Current role: <span className="font-medium text-zinc-900">{role}</span>.
      </p>
    </AppShell>
  );
}

