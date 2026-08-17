import { z } from "zod";

export const createProductSchema = z
	.object({
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
		// General attribute, always visible/editable regardless of
		// availability — validated directly, no conditional needed.
		preparationTimeHours: z.number().positive("Debe ser mayor a 0").optional(),
		// Only shown/editable in the form when availability=made_to_order —
		// left unconstrained here so a stray value inherited from a product
		// that doesn't use this field (availability=available) can't block
		// saving it. The real value check happens below, scoped to
		// made_to_order only.
		minimumOrderQuantity: z.number().optional(),
		tags: z.array(z.string().min(1)).min(1, "Agrega al menos una etiqueta"),
		isAvailable: z.boolean(),
	})
	.superRefine((data, ctx) => {
		if (data.availability !== "made_to_order") return;

		if (
			data.minimumOrderQuantity !== undefined &&
			(!Number.isInteger(data.minimumOrderQuantity) ||
				data.minimumOrderQuantity < 1)
		) {
			ctx.addIssue({
				code: "custom",
				path: ["minimumOrderQuantity"],
				message: "Debe ser un número entero de al menos 1",
			});
		}
	});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
