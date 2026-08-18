import { useMemo, useState } from "react";
import { toast } from "sonner";
import type {
	AddressDetailsResponseDto,
	LocationPredictionDto,
} from "@/entities/locations";
import { getPlace, useSearchLocations } from "@/entities/locations";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxStatus,
} from "@/shared/components/ui/combobox";
import { getErrorMessage } from "@/shared/lib/error";

export interface LocationBias {
	latitude?: number;
	longitude?: number;
	radius?: number;
}

interface LocationAutocompleteInputProps {
	value: string;
	onSelect: (description: string, details: AddressDetailsResponseDto) => void;
	id?: string;
	hasError?: boolean;
	placeholder?: string;
	/** Optional bias — results near this point rank first. */
	bias?: LocationBias;
}

function itemToStringLabel(prediction: LocationPredictionDto) {
	return prediction.description;
}

// The lowest-level piece: search-as-you-type predictions (GET
// /locations/search), then full details incl. lat/lng (GET
// /locations/places/:placeId) once one is picked. Built on Base UI's
// Combobox (filter={null} + externally-supplied `items`) rather than a
// hand-rolled input+list, so it gets real combobox/listbox ARIA semantics
// and keyboard navigation for free. Use this directly when a form only
// needs the search box; use LocationPickerField when it should also show
// the resolved coordinates.
export function LocationAutocompleteInput({
	value,
	onSelect,
	id,
	hasError,
	placeholder = "Buscar dirección...",
	bias,
}: LocationAutocompleteInputProps) {
	const [query, setQuery] = useState(value);
	// The text a selection just filled into the input — must never be
	// searched for. Left as-is (not reset) once the user types again; the
	// debounce settling to a different value is what naturally lifts the
	// skip, see useSearchLocations' skipValue doc.
	const [autoFilledText, setAutoFilledText] = useState<string | null>(null);
	const [resolvingPlaceId, setResolvingPlaceId] = useState<string | null>(null);

	const { data: response, isFetching } = useSearchLocations(query, bias, {
		skipValue: autoFilledText ?? undefined,
	});
	const predictions = useMemo(() => response?.data ?? [], [response]);

	const handleSelect = async (prediction: LocationPredictionDto | null) => {
		if (!prediction) return;
		setResolvingPlaceId(prediction.placeId);
		try {
			const details = await getPlace(prediction.placeId);
			// formattedAddress is the canonical value handed to the caller (and
			// stored in the form), even though the input keeps showing the
			// prediction text — Base UI re-asserts the selected item's own
			// label on the input after selection, so fighting it with a
			// second setQuery() here doesn't actually stick.
			onSelect(details.formattedAddress, details);
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setResolvingPlaceId(null);
		}
	};

	const trimmedQuery = query.trim();
	const isBusy = isFetching || resolvingPlaceId !== null;

	let status: string | null = null;
	if (isBusy) {
		status = "Buscando...";
	} else if (trimmedQuery.length > 0 && trimmedQuery.length < 3) {
		status = "Escribe al menos 3 caracteres";
	} else if (trimmedQuery.length >= 3 && predictions.length === 0) {
		status = `Sin resultados para "${trimmedQuery}".`;
	}

	return (
		<Combobox
			items={predictions}
			filter={null}
			itemToStringLabel={itemToStringLabel}
			inputValue={query}
			onInputValueChange={(next, { reason }) => {
				setQuery(next);
				if (reason === "item-press") setAutoFilledText(next);
			}}
			onValueChange={(next) =>
				handleSelect(next as LocationPredictionDto | null)
			}
			disabled={resolvingPlaceId !== null}
		>
			<ComboboxInput
				id={id}
				placeholder={placeholder}
				aria-invalid={hasError}
				showTrigger={false}
			/>
			<ComboboxContent>
				<ComboboxStatus>{status}</ComboboxStatus>
				<ComboboxList>
					{(prediction: LocationPredictionDto) => (
						<ComboboxItem key={prediction.placeId} value={prediction}>
							{prediction.description}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
