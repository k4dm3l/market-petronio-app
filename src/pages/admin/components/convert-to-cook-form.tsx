import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router";
import type { CreateCookDto } from "@/entities/cooks";
import { useCreateCook } from "@/entities/cooks";
import { LocationSearchField } from "@/features/geolocation";
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
				// Pre-filled default while the real location-mapping flow isn't
				// wired end-to-end; the search field still lets it be changed.
				publicLocation: "Buenaventura, Valle del Cauca",
				latitude: 3.8833,
				longitude: -77.0319,
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

				<Field data-invalid={!!formState.errors.publicLocation}>
					<FieldLabel htmlFor="convert-cook-location">Buscar</FieldLabel>
					<FieldContent>
						<LocationSearchField
							id="convert-cook-location"
							value={publicLocation}
							hasError={!!formState.errors.publicLocation}
							onSelect={(suggestion) => {
								setValue("publicLocation", suggestion.name, {
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
								formState.errors.publicLocation,
								formState.errors.latitude,
								formState.errors.longitude,
							]}
						/>
					</FieldContent>
				</Field>

				<div className="grid grid-cols-2 gap-3">
					<Field>
						<FieldLabel htmlFor="convert-cook-latitude">Latitud</FieldLabel>
						<FieldContent>
							<Input
								id="convert-cook-latitude"
								readOnly
								tabIndex={-1}
								className="cursor-default bg-muted/50 text-muted-foreground"
								value={latitude || ""}
							/>
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor="convert-cook-longitude">Longitud</FieldLabel>
						<FieldContent>
							<Input
								id="convert-cook-longitude"
								readOnly
								tabIndex={-1}
								className="cursor-default bg-muted/50 text-muted-foreground"
								value={longitude || ""}
							/>
						</FieldContent>
					</Field>
				</div>

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
