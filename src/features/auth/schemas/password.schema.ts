import { z } from "zod";

export const passwordSchema = z
	.string()
	.min(8, "Debe tener al menos 8 caracteres")
	.regex(/[a-z]/, "Debe incluir una minúscula")
	.regex(/[A-Z]/, "Debe incluir una mayúscula")
	.regex(/[0-9]/, "Debe incluir un número")
	.regex(/[^A-Za-z0-9]/, "Debe incluir un carácter especial");
