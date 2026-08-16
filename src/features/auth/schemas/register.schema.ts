import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const registerSchema = z
	.object({
		name: z.string().min(2, "El nombre es muy corto"),
		email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Confirma tu contraseña"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;
