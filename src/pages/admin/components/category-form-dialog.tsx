import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateCategory } from "@/entities/categories";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { getErrorMessage } from "@/shared/lib/error";
import {
	createCategorySchema,
	type CreateCategoryFormValues,
} from "../schemas/create-category.schema";

export function CategoryFormDialog() {
	const [open, setOpen] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const createCategory = useCreateCategory();

	const { register, handleSubmit, formState, reset } =
		useForm<CreateCategoryFormValues>({
			resolver: zodResolver(createCategorySchema),
			defaultValues: { name: "", description: "" },
		});

	const onSubmit = handleSubmit((values) => {
		setSubmitError(null);
		createCategory.mutate(
			{
				name: values.name,
				description: values.description || undefined,
			},
			{
				onSuccess: () => {
					reset();
					setOpen(false);
				},
				onError: (error) => {
					setSubmitError(getErrorMessage(error));
				},
			},
		);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					reset();
					setSubmitError(null);
				}
			}}
		>
			<DialogTrigger
				render={
					<Button
						type="button"
						aria-label="Nueva categoría"
						className="w-12 justify-center px-0 sm:w-auto sm:justify-start sm:px-2.5"
					/>
				}
			>
				<Plus className="size-4" />
				<span className="hidden sm:inline">Nueva categoría</span>
			</DialogTrigger>
			<DialogContent className="p-6 sm:max-w-[500px]">
				<form onSubmit={onSubmit} noValidate>
					<DialogHeader>
						<DialogTitle className="text-2xl">Nueva categoría</DialogTitle>
						<DialogDescription>
							Crea una categoría para organizar los productos.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<Field data-invalid={!!formState.errors.name}>
							<FieldLabel htmlFor="category-name">Nombre</FieldLabel>
							<FieldContent>
								<Input
									id="category-name"
									placeholder="Ej: Postres"
									aria-invalid={!!formState.errors.name}
									autoFocus
									{...register("name")}
								/>
								<FieldError errors={[formState.errors.name]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="category-description">
								Descripción (opcional)
							</FieldLabel>
							<FieldContent>
								<Textarea
									id="category-description"
									placeholder="Describe brevemente la categoría..."
									{...register("description")}
								/>
							</FieldContent>
						</Field>

						{submitError && (
							<p className="text-sm text-destructive">{submitError}</p>
						)}
					</FieldGroup>

					<DialogFooter className="-mx-6 -mb-6 p-6">
						<Button
							type="button"
							variant="outline"
							disabled={createCategory.isPending}
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={createCategory.isPending}>
							{createCategory.isPending ? "Creando..." : "Crear categoría"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
