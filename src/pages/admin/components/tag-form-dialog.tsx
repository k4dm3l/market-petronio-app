import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateTag } from "@/entities/tags";
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
import {
	type CreateTagFormValues,
	createTagSchema,
} from "../schemas/create-tag.schema";

export function TagFormDialog() {
	const [open, setOpen] = useState(false);
	const createTag = useCreateTag();

	const { register, handleSubmit, formState, reset } =
		useForm<CreateTagFormValues>({
			resolver: zodResolver(createTagSchema),
			defaultValues: { text: "" },
		});

	// Errors surface via the toast in useCreateTag — the dialog just stays
	// open (no onSuccess) so the user can fix and retry.
	const onSubmit = handleSubmit((values) => {
		createTag.mutate(
			{ text: values.text },
			{
				onSuccess: () => {
					reset();
					setOpen(false);
				},
			},
		);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) reset();
			}}
		>
			<DialogTrigger
				render={
					<Button
						type="button"
						aria-label="Nueva etiqueta"
						className="w-12 justify-center px-0 sm:w-auto sm:justify-start sm:px-2.5"
					/>
				}
			>
				<Plus className="size-4" />
				<span className="hidden sm:inline">Nueva etiqueta</span>
			</DialogTrigger>
			<DialogContent className="p-6 sm:max-w-[500px]">
				<form onSubmit={onSubmit} noValidate>
					<DialogHeader>
						<DialogTitle className="text-2xl">Nueva etiqueta</DialogTitle>
						<DialogDescription>
							Agrega una etiqueta al catálogo global para usar en productos.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<Field data-invalid={!!formState.errors.text}>
							<FieldLabel htmlFor="tag-text">Texto</FieldLabel>
							<FieldContent>
								<Input
									id="tag-text"
									placeholder="Ej: mariscos"
									aria-invalid={!!formState.errors.text}
									autoFocus
									{...register("text")}
								/>
								<FieldError errors={[formState.errors.text]} />
							</FieldContent>
						</Field>
					</FieldGroup>

					<DialogFooter className="-mx-6 -mb-6 p-6">
						<Button
							type="button"
							variant="outline"
							disabled={createTag.isPending}
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={createTag.isPending}>
							{createTag.isPending ? "Creando..." : "Crear etiqueta"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
