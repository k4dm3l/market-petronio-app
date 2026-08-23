import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { AddressDetailsResponseDto } from "@/entities/locations";
import { useAddAddress } from "@/entities/users";
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
import {
	type AddressFormSchemaValues,
	addressFormSchema,
} from "../schemas/address-form.schema";

interface OnboardingAddressDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * Prominent (but closeable) "add your delivery address" modal shown to
 * customers right after login when they have no saved address yet. Built
 * directly on `LocationPickerField` instead of `AddressFormDialog` because
 * saving to the profile via `useAddAddress` needs `city`/`department`/
 * `country`, which only the raw `AddressDetailsResponseDto` carries —
 * `AddressFormDialog`'s form value drops those fields.
 */
export function OnboardingAddressDialog({
	open,
	onOpenChange,
}: OnboardingAddressDialogProps) {
	const [details, setDetails] = useState<AddressDetailsResponseDto | null>(
		null,
	);
	const addAddress = useAddAddress();

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

	const closeAndReset = () => {
		reset();
		setDetails(null);
	};

	const submit = handleSubmit((values) => {
		if (!details) return;

		addAddress.mutate(
			{
				country: details.country ?? "",
				department: details.department ?? "",
				city: details.city ?? "",
				address: details.formattedAddress,
				zipcode: details.zipcode,
				coordinates: {
					type: "Point",
					coordinates: [
						details.coordinates.longitude,
						details.coordinates.latitude,
					],
				},
				isPrimary: true,
				notes: values.additionalInformation || undefined,
			},
			{
				onSuccess: () => {
					closeAndReset();
					onOpenChange(false);
				},
			},
		);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				onOpenChange(nextOpen);
				if (!nextOpen) closeAndReset();
			}}
		>
			<DialogContent className="p-6 sm:max-w-lg">
				<form onSubmit={submit} noValidate>
					<DialogHeader>
						<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
							<MapPin className="size-6" />
						</div>
						<DialogTitle className="text-2xl">
							¿A dónde te llevamos tus pedidos?
						</DialogTitle>
						<DialogDescription>
							Busca y guarda tu dirección de entrega para agilizar tus próximos
							pedidos. Puedes cambiarla cuando quieras.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<LocationPickerField
							id="onboarding-address-search"
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
							onChange={(next, nextDetails) => {
								const shouldValidate =
									nextDetails !== null || formState.isSubmitted;
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
								setDetails(nextDetails);
							}}
						/>

						<Field>
							<FieldLabel htmlFor="onboarding-address-notes">
								Información adicional (opcional)
							</FieldLabel>
							<FieldContent>
								<Textarea
									id="onboarding-address-notes"
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
							disabled={addAddress.isPending}
							onClick={() => onOpenChange(false)}
						>
							Ahora no
						</Button>
						<Button type="submit" disabled={addAddress.isPending}>
							{addAddress.isPending ? "Guardando..." : "Guardar dirección"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
