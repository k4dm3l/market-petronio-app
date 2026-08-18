import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { LocationPickerField } from "@/features/locations";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import type { AddressFormValue } from "../model/types";
import {
	type AddressFormSchemaValues,
	addressFormSchema,
} from "../schemas/address-form.schema";

interface AddressFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (value: AddressFormValue) => void;
	title?: string;
	description?: string;
	isSubmitting?: boolean;
}

/** Reusable "add a delivery address" modal — search + pick a location, then confirm. */
export function AddressFormDialog({
	open,
	onOpenChange,
	onSubmit,
	title = "Agregar dirección",
	description = "Busca y selecciona la dirección de entrega.",
	isSubmitting = false,
}: AddressFormDialogProps) {
	const { register, handleSubmit, formState, setValue, control, reset } =
		useForm<AddressFormSchemaValues>({
			resolver: zodResolver(addressFormSchema),
			defaultValues: {
				address: "",
				latitude: 0,
				longitude: 0,
				additionalInformation: "",
			},
		});

	const address = useWatch({ control, name: "address" });
	const latitude = useWatch({ control, name: "latitude" });
	const longitude = useWatch({ control, name: "longitude" });

	const submit = handleSubmit((values) => {
		onSubmit({
			address: values.address,
			latitude: values.latitude,
			longitude: values.longitude,
			additionalInformation: values.additionalInformation || undefined,
		});
		reset();
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				onOpenChange(nextOpen);
				if (!nextOpen) reset();
			}}
		>
			<DialogContent className="p-6 sm:max-w-[500px]">
				<form onSubmit={submit} noValidate>
					<DialogHeader>
						<DialogTitle className="text-2xl">{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<LocationPickerField
							id="address-form-search"
							value={{ address, latitude, longitude }}
							hasError={
								!!formState.errors.address ||
								!!formState.errors.latitude ||
								!!formState.errors.longitude
							}
							errors={[
								formState.errors.address,
								formState.errors.latitude,
								formState.errors.longitude,
							]}
							onChange={(next, details) => {
								// A real selection always validates immediately (clears any
								// visible error right away). An invalidation (details is
								// null — the user edited the text away from the last pick)
								// only validates once the form has already been submitted
								// once, so it stays silent until the user tries to submit.
								const shouldValidate =
									details !== null || formState.isSubmitted;
								setValue("address", next.address, {
									shouldValidate,
									shouldDirty: true,
								});
								setValue("latitude", next.latitude, {
									shouldValidate,
									shouldDirty: true,
								});
								setValue("longitude", next.longitude, {
									shouldValidate,
									shouldDirty: true,
								});
							}}
						/>

						<Field>
							<FieldLabel htmlFor="address-form-notes">
								Información adicional (opcional)
							</FieldLabel>
							<FieldContent>
								<Textarea
									id="address-form-notes"
									placeholder="Ej: Casa azul, junto a la panadería"
									{...register("additionalInformation")}
								/>
							</FieldContent>
						</Field>
					</FieldGroup>

					<DialogFooter className="-mx-6 -mb-6 p-6">
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							onClick={() => onOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Guardando..." : "Usar esta dirección"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
