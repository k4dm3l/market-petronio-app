import { z } from "zod";

export const createCategorySchema = z.object({
	name: z.string().min(2, "El nombre es muy corto"),
	description: z.string().optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
