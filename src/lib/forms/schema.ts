import { z } from "zod";

export const FormStatusSchema = z.enum(["draft", "active", "archived"]);
export type FormStatus = z.infer<typeof FormStatusSchema>;

export const FormInputSchema = z.object({
  title: z.string().trim().min(3, "Назва має містити щонайменше 3 символи"),
  description: z
    .string()
    .trim()
    .max(2000, "Опис занадто довгий")
    .optional()
    .or(z.literal("")),
  fieldsCount: z
    .number({ error: "К-сть полів має бути числом" })
    .int("К-сть полів має бути цілим числом")
    .min(0, "Мінімум 0")
    .max(50, "Максимум 50"),
  status: FormStatusSchema,
});

export type FormInput = z.infer<typeof FormInputSchema>;

export const FormRecordSchema = FormInputSchema.extend({
  _id: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export type FormRecord = z.infer<typeof FormRecordSchema>;

