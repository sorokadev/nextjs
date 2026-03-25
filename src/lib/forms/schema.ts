import { z } from "zod";

export const FormStatusSchema = z.enum(["draft", "active", "archived"]);
export type FormStatus = z.infer<typeof FormStatusSchema>;

export const FormInputSchema = z.object({
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

export type FormInput = z.infer<typeof FormInputSchema>;

export const FormRecordSchema = FormInputSchema.extend({
  _id: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export type FormRecord = z.infer<typeof FormRecordSchema>;

