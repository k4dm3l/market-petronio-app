import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { LocationSearchField } from "@/features/geolocation";
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
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
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
						<Field data-invalid={!!formState.errors.address}>
							<FieldLabel htmlFor="address-form-search">Dirección</FieldLabel>
							<FieldContent>
								<LocationSearchField
									id="address-form-search"
									value={address}
									hasError={!!formState.errors.address}
									onSelect={(suggestion) => {
										setValue("address", suggestion.name, {
											shouldValidate: true,
											shouldDirty: true,
										});
										setValue("latitude", suggestion.latitude, {
											shouldValidate: true,
											shouldDirty: true,
										});
										setValue("longitude", suggestion.longitude, {
											shouldValidate: true,
											shouldDirty: true,
										});
									}}
								/>
								<FieldError
									errors={[
										formState.errors.address,
										formState.errors.latitude,
										formState.errors.longitude,
									]}
								/>
							</FieldContent>
						</Field>

						<div className="grid grid-cols-2 gap-3">
							<Field>
								<FieldLabel htmlFor="address-form-latitude">Latitud</FieldLabel>
								<FieldContent>
									<Input
										id="address-form-latitude"
										readOnly
										tabIndex={-1}
										className="cursor-default bg-muted/50 text-muted-foreground"
										value={latitude || ""}
									/>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor="address-form-longitude">
									Longitud
								</FieldLabel>
								<FieldContent>
									<Input
										id="address-form-longitude"
										readOnly
										tabIndex={-1}
										className="cursor-default bg-muted/50 text-muted-foreground"
										value={longitude || ""}
									/>
								</FieldContent>
							</Field>
						</div>

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
