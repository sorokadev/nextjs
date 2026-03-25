"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toast-store";
import { FormStatusSchema } from "@/lib/forms/schema";

const NewFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .optional()
    .or(z.literal("")),
  fieldsCount: z
    .number({ error: "Field count must be a number" })
    .int("Field count must be an integer")
    .min(0, "Minimum is 0")
    .max(50, "Maximum is 50"),
  status: FormStatusSchema,
});

type NewFormValues = z.infer<typeof NewFormSchema>;

type ApiCreateResponse =
  | { item: { _id: string } }
  | { error: string; message?: string; issues?: unknown };

export function NewFormForm() {
  const router = useRouter();
  const pushToast = useToastStore((s) => s.push);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo<NewFormValues>(
    () => ({ title: "", description: "", fieldsCount: 0, status: "draft" }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewFormValues>({
    resolver: zodResolver(NewFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await res.json().catch(() => null)) as ApiCreateResponse | null;
      if (!res.ok) {
        pushToast({
          kind: "error",
          title: "Failed to create form",
          message:
            data && "message" in data && data.message
              ? data.message
              : "Please check the fields and try again.",
        });
        return;
      }

      pushToast({ kind: "success", title: "Form created" });
      router.replace("/forms");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-900">
          Title
        </label>
        <input
          id="title"
          placeholder="e.g. Event registration"
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
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Briefly: what the form is for and what you collect"
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
            Field count
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
            Status
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
      >
        {isSubmitting ? "Creating..." : "Create"}
      </button>
    </form>
  );
}

