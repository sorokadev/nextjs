"use client";

import { useToastStore } from "@/store/toast-store";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-xl border bg-white shadow-sm",
            "px-4 py-3",
            "focus-within:ring-2 focus-within:ring-zinc-900/20",
            t.kind === "success" ? "border-emerald-200" : "",
            t.kind === "error" ? "border-rose-200" : "",
            t.kind === "info" ? "border-sky-200" : "",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-zinc-900">{t.title}</div>
              {t.message ? (
                <div className="mt-0.5 text-sm text-zinc-600">{t.message}</div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

