import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link } from "react-router";
import { useGetAllCategories } from "@/entities/categories";
import type { CreateProductDto, Product, UpdateProductDto } from "@/entities/products";
import {
	useCreateProduct,
	useRemoveProductImage,
	useUpdateProduct,
	useUploadProductImage,
} from "@/entities/products";
import { Button } from "@/shared/components/ui/button";
import { CurrencyInput } from "@/shared/components/ui/currency-input";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { getErrorMessage } from "@/shared/lib/error";
import {
	createProductSchema,
	type CreateProductFormValues,
} from "../schemas/create-product.schema";
import { ProductImageUploadField } from "./product-image-upload-field";
import { SpecialtyChipsField } from "./specialty-chips-field";

function toOptionalNumber(value: string): number | undefined {
	return value === "" ? undefined : Number(value);
}

// Mirrors CurrencyInput's approach for required number fields: an emptied
// input reports 0 (a valid `number`) instead of `undefined`, so `.min(1)`
// produces its real message instead of Zod's generic type-mismatch one.
function toRequiredNumber(value: string): number {
	return value === "" ? 0 : Number(value);
}

interface ProductFormProps {
	cookId: string;
	/** When provided, the form edits this product instead of creating a new one. */
	product?: Product;
	onSuccess: () => void;
}

export function ProductForm({ cookId, product, onSuccess }: ProductFormProps) {
	const isEditMode = Boolean(product);

	const { register, handleSubmit, formState, setValue, control } =
		useForm<CreateProductFormValues>({
			resolver: zodResolver(createProductSchema),
			defaultValues: {
				name: product?.name ?? "",
				description: product?.description ?? "",
				price: product?.price ?? 0,
				stock: product?.stock ?? 0,
				categoryId: product?.categoryId ?? "",
				availability: product?.availability ?? "available",
				preparationTimeHours: product?.preparationTimeHours,
				minimumOrderQuantity: product?.minimumOrderQuantity,
				tags: product?.tags ?? [],
				isAvailable: product?.isAvailable ?? true,
			},
		});
	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();
	const uploadProductImage = useUploadProductImage();
	const removeProductImage = useRemoveProductImage();
	const { data: categories } = useGetAllCategories();

	const [newImages, setNewImages] = useState<File[]>([]);
	const [isUploadingImages, setIsUploadingImages] = useState(false);

	const availability = useWatch({ control, name: "availability" });
	const tags = useWatch({ control, name: "tags" });

	const isSubmitting =
		createProduct.isPending ||
		updateProduct.isPending ||
		uploadProductImage.isPending ||
		isUploadingImages;

	const onSubmit = handleSubmit((values) => {
		const shared = {
			name: values.name,
			description: values.description,
			price: values.price,
			stock: values.stock,
			categoryId: values.categoryId,
			availability: values.availability,
			preparationTimeHours:
				values.availability === "made_to_order"
					? values.preparationTimeHours
					: undefined,
			minimumOrderQuantity:
				values.availability === "made_to_order"
					? values.minimumOrderQuantity
					: undefined,
			tags: values.tags,
			isAvailable: values.isAvailable,
		};

		if (isEditMode && product) {
			// Images upload immediately as they're dropped (see
			// ProductImageUploadField), so there's nothing staged to flush here.
			const payload: UpdateProductDto = shared;
			updateProduct.mutate({ id: product.id, payload }, { onSuccess });
		} else {
			// The product doesn't exist yet, so any staged images could only be
			// added once we have an id — upload them now that it does.
			const payload: CreateProductDto = { ...shared, cookId };
			createProduct.mutate(payload, {
				onSuccess: async (created) => {
					if (newImages.length > 0) {
						setIsUploadingImages(true);
						for (const file of newImages) {
							await uploadProductImage.mutateAsync({ id: created.id, file });
						}
						setIsUploadingImages(false);
					}
					onSuccess();
				},
			});
		}
	});

	return (
		<form onSubmit={onSubmit} noValidate>
			<FieldGroup>
				<h2 className="text-2xl font-semibold">Imágenes</h2>
				<ProductImageUploadField
					productId={product?.id}
					existingImages={product?.images}
					onRemoveExisting={(imageId) => {
						if (!product) return;
						removeProductImage.mutate({ id: product.id, imageId });
					}}
					newFiles={newImages}
					onNewFilesChange={setNewImages}
				/>

				<Separator />
				<h2 className="text-2xl font-semibold">Detalles</h2>

				<Field data-invalid={!!formState.errors.name}>
					<FieldLabel htmlFor="product-name">Nombre</FieldLabel>
					<FieldContent>
						<Input
							id="product-name"
							placeholder="Ej: Encocado de camarón"
							aria-invalid={!!formState.errors.name}
							{...register("name")}
						/>
						<FieldError errors={[formState.errors.name]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.description}>
					<FieldLabel htmlFor="product-description">Descripción</FieldLabel>
					<FieldContent>
						<Textarea
							id="product-description"
							placeholder="Describe el producto, sus ingredientes y qué lo hace especial..."
							aria-invalid={!!formState.errors.description}
							{...register("description")}
						/>
						<FieldError errors={[formState.errors.description]} />
					</FieldContent>
				</Field>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<Field data-invalid={!!formState.errors.categoryId}>
						<FieldLabel htmlFor="product-category">Categoría</FieldLabel>
						<FieldContent>
							<Controller
								control={control}
								name="categoryId"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											id="product-category"
											className="w-full"
											aria-invalid={!!formState.errors.categoryId}
										>
											<SelectValue placeholder="Selecciona una categoría" />
										</SelectTrigger>
										<SelectContent>
											{categories?.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							<FieldError errors={[formState.errors.categoryId]} />
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel>Disponibilidad</FieldLabel>
						<FieldContent>
							<div className="flex h-12 gap-2">
								<Button
									type="button"
									variant={availability === "available" ? "default" : "outline"}
									className="flex-1"
									onClick={() =>
										setValue("availability", "available", { shouldValidate: true })
									}
								>
									Disponible
								</Button>
								<Button
									type="button"
									variant={
										availability === "made_to_order" ? "default" : "outline"
									}
									className="flex-1"
									onClick={() =>
										setValue("availability", "made_to_order", {
											shouldValidate: true,
										})
									}
								>
									Bajo pedido
								</Button>
							</div>
						</FieldContent>
					</Field>
				</div>

				<Field data-invalid={!!formState.errors.tags}>
					<FieldLabel htmlFor="product-tags">Etiquetas</FieldLabel>
					<FieldContent>
						<SpecialtyChipsField
							id="product-tags"
							value={tags}
							hasError={!!formState.errors.tags}
							onChange={(next) =>
								setValue("tags", next, {
									shouldDirty: true,
									shouldValidate: true,
								})
							}
						/>
						<FieldError errors={[formState.errors.tags]} />
					</FieldContent>
				</Field>

				<Separator />
				<h2 className="text-2xl font-semibold">Precio e inventario</h2>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<Field data-invalid={!!formState.errors.price}>
						<FieldLabel htmlFor="product-price">Precio (COP)</FieldLabel>
						<FieldContent>
							<Controller
								control={control}
								name="price"
								render={({ field }) => (
									<CurrencyInput
										id="product-price"
										aria-invalid={!!formState.errors.price}
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							<FieldError errors={[formState.errors.price]} />
						</FieldContent>
					</Field>

					<Field data-invalid={!!formState.errors.stock}>
						<FieldLabel htmlFor="product-stock">Stock</FieldLabel>
						<FieldContent>
							<Input
								id="product-stock"
								type="number"
								inputMode="numeric"
								min={0}
								aria-invalid={!!formState.errors.stock}
								{...register("stock", { setValueAs: toRequiredNumber })}
							/>
							<FieldError errors={[formState.errors.stock]} />
						</FieldContent>
					</Field>
				</div>

				{availability === "made_to_order" && (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Field data-invalid={!!formState.errors.minimumOrderQuantity}>
							<FieldLabel htmlFor="product-min-order">
								Cantidad mínima de pedido
							</FieldLabel>
							<FieldContent>
								<Input
									id="product-min-order"
									type="number"
									inputMode="numeric"
									min={0}
									{...register("minimumOrderQuantity", {
										setValueAs: toOptionalNumber,
									})}
								/>
								<FieldError errors={[formState.errors.minimumOrderQuantity]} />
							</FieldContent>
						</Field>

						<Field data-invalid={!!formState.errors.preparationTimeHours}>
							<FieldLabel htmlFor="product-prep-time">
								Tiempo de preparación (horas)
							</FieldLabel>
							<FieldContent>
								<Input
									id="product-prep-time"
									type="number"
									inputMode="numeric"
									min={0}
									placeholder="Ej: 48"
									aria-invalid={!!formState.errors.preparationTimeHours}
									{...register("preparationTimeHours", {
										setValueAs: toOptionalNumber,
									})}
								/>
								<FieldError errors={[formState.errors.preparationTimeHours]} />
							</FieldContent>
						</Field>
					</div>
				)}

				<Controller
					control={control}
					name="isAvailable"
					render={({ field }) => (
						<div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
							<div className="flex flex-col gap-0.5">
								<span className="text-sm font-medium text-foreground">
									Visible en el catálogo
								</span>
								<span className="text-sm text-muted-foreground">
									Los clientes solo ven productos visibles.
								</span>
							</div>
							<Switch
								checked={field.value}
								onCheckedChange={field.onChange}
								aria-label="Visible en el catálogo"
							/>
						</div>
					)}
				/>

				{(createProduct.isError || updateProduct.isError) && (
					<FieldError>
						{getErrorMessage(createProduct.error ?? updateProduct.error)}
					</FieldError>
				)}

				<Separator />

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						render={<Link to={`/admin/cooks/${cookId}/products`} />}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting
							? isEditMode
								? "Guardando cambios..."
								: "Creando producto..."
							: isEditMode
								? "Guardar cambios"
								: "Crear producto"}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
}
