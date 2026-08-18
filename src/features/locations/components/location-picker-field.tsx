import type { AddressDetailsResponseDto } from "@/entities/locations";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
	LocationAutocompleteInput,
	type LocationBias,
} from "./location-autocomplete-input";

export interface LocationPickerValue {
	address: string;
	latitude: number;
	longitude: number;
}

interface LocationPickerFieldProps {
	value: LocationPickerValue;
	/** `details` is the full place lookup — read city/department/country/zipcode off it if the form needs more than address+lat+lng. */
	onChange: (
		value: LocationPickerValue,
		details: AddressDetailsResponseDto,
	) => void;
	id?: string;
	hasError?: boolean;
	errors?: Array<{ message?: string } | undefined>;
	searchLabel?: string;
	searchPlaceholder?: string;
	/** Hide the read-only Latitud/Longitud boxes for forms that only need the resolved value, not to display it. Defaults to true. */
	showCoordinates?: boolean;
	bias?: LocationBias;
}

// The full "Buscar / Latitud / Longitud" block, reused by every form that
// captures a location (convert-to-cook, delivery addresses, ...). A thin
// controlled wrapper around LocationAutocompleteInput — use that directly
// instead if a form only needs the search box.
export function LocationPickerField({
	value,
	onChange,
	id = "location-picker",
	hasError = false,
	errors,
	searchLabel = "Buscar",
	searchPlaceholder = "Buscar dirección...",
	showCoordinates = true,
	bias,
}: LocationPickerFieldProps) {
	return (
		<div className="flex flex-col gap-3">
			<Field data-invalid={hasError}>
				<FieldLabel htmlFor={id}>{searchLabel}</FieldLabel>
				<FieldContent>
					<LocationAutocompleteInput
						id={id}
						value={value.address}
						hasError={hasError}
						placeholder={searchPlaceholder}
						bias={bias}
						onSelect={(description, details) => {
							const { latitude, longitude } = details.coordinates;
							onChange({ address: description, latitude, longitude }, details);
						}}
					/>
					<FieldError errors={errors} />
				</FieldContent>
			</Field>

			{showCoordinates && (
				<div className="grid grid-cols-2 gap-3">
					<Field>
						<FieldLabel htmlFor={`${id}-latitude`}>Latitud</FieldLabel>
						<FieldContent>
							<Input
								id={`${id}-latitude`}
								readOnly
								tabIndex={-1}
								className="cursor-default bg-muted/50 text-muted-foreground"
								value={value.latitude || ""}
							/>
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor={`${id}-longitude`}>Longitud</FieldLabel>
						<FieldContent>
							<Input
								id={`${id}-longitude`}
								readOnly
								tabIndex={-1}
								className="cursor-default bg-muted/50 text-muted-foreground"
								value={value.longitude || ""}
							/>
						</FieldContent>
					</Field>
				</div>
			)}
		</div>
	);
}
