import { AppShell } from "@/components/AppShell";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Вхід</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Вкажіть email та оберіть роль. Це демо-логін через cookie, без NextAuth.
        </p>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </AppShell>
  );
}

