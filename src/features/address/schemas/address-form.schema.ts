import { z } from "zod";

export const addressFormSchema = z.object({
	address: z.string().min(1, "Selecciona una dirección de la lista"),
	// 0 is used as the "not selected yet" sentinel — no real Colombian
	// location sits at exactly (0, 0), and it keeps this a plain `number`
	// instead of `number | null` (avoids nullable+refine narrowing quirks
	// with zodResolver's inferred type). Mirrors convert-to-cook.schema.ts.
	latitude: z.number().refine((v) => v !== 0, "Selecciona una dirección de la lista"),
	longitude: z.number().refine((v) => v !== 0, "Selecciona una dirección de la lista"),
	additionalInformation: z.string().optional(),
});

export type AddressFormSchemaValues = z.infer<typeof addressFormSchema>;
