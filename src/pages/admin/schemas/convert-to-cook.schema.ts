import { z } from "zod";

// Must reflect entities/cooks PAYMENT_METHOD_OPTIONS ids.
const paymentMethodSchema = z.object({
	type: z.enum([
		"pse",
		"nequi",
		"daviplata",
		"bancolombia",
		"davivienda",
		"bbva",
		"banco_de_bogota",
		"banco_de_occidente",
		"scotiabank_colpatria",
		"itau",
		"banco_agrario",
		"lulo_bank",
		"movii",
		"rappipay",
		"tarjeta",
		"bre_b",
		"efectivo",
	]),
	// "Efectivo" (and similar) don't always have a meaningful detail to fill in,
	// so this is left unconstrained rather than required.
	details: z.string(),
	isEnabled: z.boolean(),
});

export const convertToCookSchema = z.object({
	displayName: z.string().min(2, "El nombre público es muy corto"),
	bio: z.string().optional(),
	specialties: z.array(z.string().min(1)),
	publicLocation: z.string().min(1, "Selecciona una ubicación de la lista"),
	// 0 is used as the "not selected yet" sentinel — no real Colombian
	// location sits at exactly (0, 0), and it keeps this a plain `number`
	// instead of `number | null` (avoids nullable+refine narrowing quirks
	// with zodResolver's inferred type).
	latitude: z.number().refine((v) => v !== 0, "Selecciona una ubicación de la lista"),
	longitude: z.number().refine((v) => v !== 0, "Selecciona una ubicación de la lista"),
	paymentMethods: z.array(paymentMethodSchema),
	// Digits only — the input itself strips anything else as the user types,
	// this is just a backstop for paste/autofill.
	contactWhatsApp: z.string().regex(/^\d*$/, "Solo se permiten números").optional(),
});

export type ConvertToCookFormValues = z.infer<typeof convertToCookSchema>;
