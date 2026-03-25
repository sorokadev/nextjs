"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toast-store";
import { FormInputSchema, type FormRecord } from "@/lib/forms/schema";

type Values = {
  title: string;
  description?: string;
  fieldsCount: number;
  status: "draft" | "active" | "archived";
};

type ApiResponse =
  | { item: FormRecord }
  | { ok: true }
  | { error: string; message?: string; issues?: unknown };

export function EditFormForm({ item }: { item: FormRecord }) {
  const router = useRouter();
  const pushToast = useToastStore((s) => s.push);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(FormInputSchema),
    defaultValues: {
      title: item.title,
      description: item.description ?? "",
      fieldsCount: item.fieldsCount,
      status: item.status,
    },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/forms/${item._id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as ApiResponse | null;
      if (!res.ok) {
        pushToast({
          kind: "error",
          title: "Не вдалося зберегти",
          message:
            data && "message" in data && data.message ? data.message : "Перевірте поля та повторіть.",
        });
        return;
      }

      pushToast({ kind: "success", title: "Зміни збережено" });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  });

  const onDelete = async () => {
    if (!confirm("Видалити форму? Цю дію не можна скасувати.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/forms/${item._id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as ApiResponse | null;
      if (!res.ok) {
        pushToast({
          kind: "error",
          title: "Не вдалося видалити",
          message:
            data && "message" in data && data.message ? data.message : "Спробуйте ще раз.",
        });
        return;
      }

      pushToast({ kind: "success", title: "Форму видалено" });
      router.replace("/forms");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-900">
          Назва
        </label>
        <input
          id="title"
          placeholder="Напр. Заявка на подію"
          className={[
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none",
            "placeholder:text-zinc-500 placeholder:opacity-100",
            "focus:ring-2 focus:ring-zinc-900/20",
            errors.title ? "border-rose-300" : "border-zinc-200",
          ].join(" ")}
          {...register("title")}
        />
        {errors.title ? <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p> : null}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-900">
          Опис (необов’язково)
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Коротко: навіщо форма і що збираємо"
          className={[
            "mt-1 w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none",
            "placeholder:text-zinc-500 placeholder:opacity-100",
            "focus:ring-2 focus:ring-zinc-900/20",
            errors.description ? "border-rose-300" : "border-zinc-200",
          ].join(" ")}
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-rose-600">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fieldsCount" className="block text-sm font-medium text-zinc-900">
            К-сть полів
          </label>
          <input
            id="fieldsCount"
            type="number"
            inputMode="numeric"
            min={0}
            max={50}
            className={[
              "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none",
              "focus:ring-2 focus:ring-zinc-900/20",
              errors.fieldsCount ? "border-rose-300" : "border-zinc-200",
            ].join(" ")}
            {...register("fieldsCount", { valueAsNumber: true })}
          />
          {errors.fieldsCount ? (
            <p className="mt-1 text-sm text-rose-600">{errors.fieldsCount.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-900">
            Статус
          </label>
          <select
            id="status"
            className={[
              "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none",
              "bg-white text-zinc-900",
              "focus:ring-2 focus:ring-zinc-900/20",
              errors.status ? "border-rose-300" : "border-zinc-200",
            ].join(" ")}
            {...register("status")}
          >
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
          {errors.status ? <p className="mt-1 text-sm text-rose-600">{errors.status.message}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSaving || isDeleting}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
        >
          {isSaving ? "Зберігаємо..." : "Зберегти"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isSaving || isDeleting}
          className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
        >
          {isDeleting ? "Видаляємо..." : "Видалити"}
        </button>
      </div>
    </form>
  );
}

