import { z } from "zod";

export const createTagSchema = z.object({
	text: z.string().min(1, "El texto es requerido").max(50, "Máximo 50 caracteres"),
});

export type CreateTagFormValues = z.infer<typeof createTagSchema>;
