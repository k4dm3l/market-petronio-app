import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const recoveryResetSchema = z
	.object({
		email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
		otp: z
			.string()
			.length(6, "El código debe tener 6 dígitos")
			.regex(/^\d+$/, "El código solo debe contener números"),
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export type RecoveryResetFormValues = z.infer<typeof recoveryResetSchema>;
