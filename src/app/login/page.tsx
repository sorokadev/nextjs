import { AppShell } from "@/components/AppShell";
import { LoginForm } from "@/components/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Enter your email and pick a role. This is a demo cookie-based login (no NextAuth).
        </p>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <Suspense
            fallback={<div className="text-sm text-zinc-600">Loading…</div>}
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </AppShell>
  );
}

