import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router";
import type { CreateCookDto } from "@/entities/cooks";
import { useCreateCook } from "@/entities/cooks";
import { LocationPickerField } from "@/features/locations";
import { Button } from "@/shared/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import {
	type ConvertToCookFormValues,
	convertToCookSchema,
} from "../schemas/convert-to-cook.schema";
import { PaymentMethodsField } from "./payment-methods-field";
import { SpecialtyChipsField } from "./specialty-chips-field";

interface ConvertToCookFormProps {
	userId: string;
	onSuccess: () => void;
}

export function ConvertToCookForm({
	userId,
	onSuccess,
}: ConvertToCookFormProps) {
	const { register, handleSubmit, formState, setValue, control } =
		useForm<ConvertToCookFormValues>({
			resolver: zodResolver(convertToCookSchema),
			defaultValues: {
				displayName: "",
				bio: "",
				specialties: [],
				publicLocation: "",
				latitude: 0,
				longitude: 0,
				paymentMethods: [],
				contactWhatsApp: "",
			},
		});
	const createCook = useCreateCook();

	const specialties = useWatch({ control, name: "specialties" });
	const publicLocation = useWatch({ control, name: "publicLocation" });
	const latitude = useWatch({ control, name: "latitude" });
	const longitude = useWatch({ control, name: "longitude" });

	const onSubmit = handleSubmit((values) => {
		const payload: CreateCookDto = {
			userId,
			displayName: values.displayName,
			bio: values.bio,
			specialties: values.specialties,
			publicLocation: values.publicLocation,
			latitude: values.latitude,
			longitude: values.longitude,
			paymentMethods: values.paymentMethods,
			contactWhatsApp: values.contactWhatsApp,
		};
		createCook.mutate(payload, { onSuccess });
	});

	return (
		<form onSubmit={onSubmit} noValidate>
			<FieldGroup>
				<h2 className="text-2xl font-semibold">Perfil</h2>

				<Field data-invalid={!!formState.errors.displayName}>
					<FieldLabel htmlFor="convert-cook-display-name">
						Nombre público
					</FieldLabel>
					<FieldContent>
						<Input
							id="convert-cook-display-name"
							aria-invalid={!!formState.errors.displayName}
							{...register("displayName")}
						/>
						<FieldError errors={[formState.errors.displayName]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.bio}>
					<FieldLabel htmlFor="convert-cook-bio">Bio</FieldLabel>
					<FieldContent>
						<Textarea
							id="convert-cook-bio"
							aria-invalid={!!formState.errors.bio}
							{...register("bio")}
						/>
						<FieldError errors={[formState.errors.bio]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.specialties}>
					<FieldLabel htmlFor="convert-cook-specialties">
						Especialidades
					</FieldLabel>
					<FieldContent>
						<SpecialtyChipsField
							id="convert-cook-specialties"
							value={specialties}
							hasError={!!formState.errors.specialties}
							onChange={(next) =>
								setValue("specialties", next, {
									shouldDirty: true,
									shouldValidate: true,
								})
							}
						/>
						<FieldError errors={[formState.errors.specialties]} />
					</FieldContent>
				</Field>

				<Separator />
				<h2 className="text-2xl font-semibold">Ubicación</h2>

				<LocationPickerField
					id="convert-cook-location"
					value={{ address: publicLocation, latitude, longitude }}
					hasError={
						!!formState.errors.publicLocation ||
						!!formState.errors.latitude ||
						!!formState.errors.longitude
					}
					errors={[
						formState.errors.publicLocation,
						formState.errors.latitude,
						formState.errors.longitude,
					]}
					onChange={(next, details) => {
						// A real selection always validates immediately (clears any
						// visible error right away). An invalidation (details is null —
						// the user edited the text away from the last pick) only
						// validates once the form has already been submitted once, so
						// it stays silent until the user tries to submit.
						const shouldValidate = details !== null || formState.isSubmitted;
						setValue("publicLocation", next.address, {
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

				<Separator />
				<h2 className="text-2xl font-semibold">Contacto</h2>

				<Field data-invalid={!!formState.errors.contactWhatsApp}>
					<FieldLabel htmlFor="convert-cook-whatsapp">WhatsApp</FieldLabel>
					<FieldContent>
						<Input
							id="convert-cook-whatsapp"
							type="tel"
							inputMode="numeric"
							autoComplete="tel"
							placeholder="3001234567"
							aria-invalid={!!formState.errors.contactWhatsApp}
							{...register("contactWhatsApp", {
								onChange: (event) => {
									event.target.value = event.target.value.replace(/\D/g, "");
								},
							})}
						/>
						<FieldError errors={[formState.errors.contactWhatsApp]} />
					</FieldContent>
				</Field>

				<Separator />
				<h2 className="text-2xl font-semibold">Métodos de pago</h2>

				<Field data-invalid={!!formState.errors.paymentMethods}>
					<FieldContent>
						<PaymentMethodsField control={control} />
						<FieldError
							errors={[
								Array.isArray(formState.errors.paymentMethods)
									? undefined
									: formState.errors.paymentMethods,
							]}
						/>
					</FieldContent>
				</Field>

				<Separator />

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						render={<Link to="/admin/customers" />}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={createCook.isPending}>
						{createCook.isPending
							? "Creando perfil..."
							: "Convertir en cocinero"}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
}
