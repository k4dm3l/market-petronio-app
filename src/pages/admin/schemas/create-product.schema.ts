import { z } from "zod";

export const createProductSchema = z.object({
	name: z.string().min(2, "El nombre es muy corto"),
	description: z.string().min(1, "La descripción es requerida"),
	// COP has no subunit — prices are always whole pesos.
	price: z
		.number()
		.int("El precio debe ser un número entero")
		.positive("El precio debe ser mayor a 0"),
	stock: z
		.number()
		.int("El stock debe ser un número entero")
		.min(1, "Debe ser al menos 1"),
	categoryId: z.string().min(1, "Selecciona una categoría"),
	availability: z.enum(["available", "made_to_order"]),
	preparationTimeHours: z.number().positive("Debe ser mayor a 0").optional(),
	minimumOrderQuantity: z
		.number()
		.int("Debe ser un número entero")
		.min(1, "Debe ser al menos 1")
		.optional(),
	tags: z.array(z.string().min(1)).min(1, "Agrega al menos una etiqueta"),
	isAvailable: z.boolean(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
