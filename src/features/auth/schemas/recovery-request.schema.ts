import { z } from "zod";

export const recoveryRequestSchema = z.object({
	email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
});

export type RecoveryRequestFormValues = z.infer<typeof recoveryRequestSchema>;
