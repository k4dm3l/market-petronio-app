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
import { Spinner } from "@/shared/components/ui/spinner";
import { getErrorMessage } from "@/shared/lib/error";

export interface LocationBias {
	latitude?: number;
	longitude?: number;
	radius?: number;
}

interface LocationAutocompleteInputProps {
	value: string;
	onSelect: (description: string, details: AddressDetailsResponseDto) => void;
	/** Called once when the input text diverges from the last confirmed selection (or the initial `value`) by the user typing — signals the caller should drop any previously-resolved coordinates until a new suggestion is picked. */
	onInvalidate?: () => void;
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
	onInvalidate,
	id,
	hasError,
	placeholder = "Buscar dirección...",
	bias,
}: LocationAutocompleteInputProps) {
	const [query, setQuery] = useState(value);
	// The text of the last confirmed selection — either one made in this
	// session, or (initially) the `value` this component was mounted with.
	// Used for two things: (1) skip re-searching the text a selection just
	// filled into the input, see useSearchLocations' skipValue doc; (2)
	// detect when the user edits away from it, so we can tell the caller the
	// previously-resolved coordinates no longer match what's on screen.
	const [autoFilledText, setAutoFilledText] = useState<string | null>(
		value || null,
	);
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

	let status: React.ReactNode = null;
	if (isBusy) {
		status = (
			<span className="flex items-center gap-2">
				<Spinner className="size-3.5" />
				Buscando...
			</span>
		);
	} else if (trimmedQuery.length === 0) {
		status = "Escribe para buscar una dirección";
	} else if (trimmedQuery.length < 3) {
		status = "Escribe al menos 3 caracteres";
	} else if (predictions.length === 0) {
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
				if (reason === "item-press") {
					setAutoFilledText(next);
				} else if (autoFilledText !== null && next !== autoFilledText) {
					setAutoFilledText(null);
					onInvalidate?.();
				}
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
				showClear
			/>
			<ComboboxContent className="min-w-(--anchor-width)">
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
