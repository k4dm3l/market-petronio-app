import { z } from "zod";

// Must reflect entities/cooks PAYMENT_METHOD_OPTIONS ids (= PaymentMethodDto.type).
const paymentMethodSchema = z.object({
	type: z.enum(["nequi", "daviplata", "bank_transfer"]),
	// "Efectivo" (and similar) don't always have a meaningful detail to fill in,
	// so this is left unconstrained rather than required.
	details: z.string(),
	isEnabled: z.boolean(),
});

export const convertToCookSchema = z.object({
	displayName: z.string().min(2, "El nombre público es muy corto"),
	bio: z.string().min(1, "La bio es requerida"),
	specialties: z
		.array(z.string().min(1))
		.min(1, "Agrega al menos una especialidad"),
	publicLocation: z.string().min(1, "Selecciona una ubicación de la lista"),
	// 0 is used as the "not selected yet" sentinel — no real Colombian
	// location sits at exactly (0, 0), and it keeps this a plain `number`
	// instead of `number | null` (avoids nullable+refine narrowing quirks
	// with zodResolver's inferred type).
	latitude: z
		.number()
		.refine((v) => v !== 0, "Selecciona una ubicación de la lista"),
	longitude: z
		.number()
		.refine((v) => v !== 0, "Selecciona una ubicación de la lista"),
	paymentMethods: z
		.array(paymentMethodSchema)
		.min(1, "Agrega al menos un método de pago"),
	// Digits only — the input itself strips anything else as the user types,
	// this is just a backstop for paste/autofill.
	contactWhatsApp: z
		.string()
		.min(1, "El WhatsApp es requerido")
		.regex(/^\d+$/, "Solo se permiten números"),
});

export type ConvertToCookFormValues = z.infer<typeof convertToCookSchema>;
