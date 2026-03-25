"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { USER_ROLES } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";
import { useToastStore } from "@/store/toast-store";

const LoginClientSchema = z.object({
  email: z.string().email("Вкажіть коректний email"),
  role: z.enum(USER_ROLES),
});

type LoginValues = z.infer<typeof LoginClientSchema>;

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next");
  const setRole = useAuthStore((s) => s.setRole);
  const pushToast = useToastStore((s) => s.push);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo<LoginValues>(
    () => ({ email: "admin@example.com", role: "admin" }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginClientSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        pushToast({
          kind: "error",
          title: "Не вдалося увійти",
          message: "Перевірте дані та повторіть спробу.",
        });
        return;
      }

      setRole(values.role);
      pushToast({ kind: "success", title: "Успішний вхід" });
      router.replace(next && next.startsWith("/") ? next : "/forms");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className={[
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none",
            "placeholder:text-zinc-500 placeholder:opacity-100",
            "focus:ring-2 focus:ring-zinc-900/20",
            errors.email ? "border-rose-300" : "border-zinc-200",
          ].join(" ")}
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-zinc-900">
          Роль
        </label>
        <select
          id="role"
          className={[
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none",
            "bg-white text-zinc-900",
            "focus:ring-2 focus:ring-zinc-900/20",
            errors.role ? "border-rose-300" : "border-zinc-200",
          ].join(" ")}
          {...register("role")}
        >
          <option value="individual">Individual</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role ? (
          <p className="mt-1 text-sm text-rose-600">{errors.role.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
      >
        {isSubmitting ? "Входимо..." : "Увійти"}
      </button>
    </form>
  );
}

