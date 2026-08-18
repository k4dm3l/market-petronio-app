import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";
import { search } from "../api/locations";
import type { SearchLocationsQuery } from "../model/types";

interface LocationBias {
	latitude?: number;
	longitude?: number;
	radius?: number;
}

/**
 * Debounced per the API's own guidance (300–500ms). `staleTime` means
 * re-searching the same text within 5 minutes is served from cache instead
 * of hitting the network again.
 *
 * `skipValue`: a text to never search for (compared against the *debounced*
 * value, not the raw one). Used to stop a selection from re-triggering a
 * search for the text it just filled into the input. Comparing against the
 * debounced value matters — the debounce timer keeps running independently
 * of anything the caller does, so comparing against the raw query would let
 * a stale, already-settled debounced value slip through the instant the
 * caller stops skipping, before the debounce catches up to what the user
 * actually typed next.
 */
export function useSearchLocations(
	query: string,
	bias: LocationBias = {},
	options: { skipValue?: string } = {},
) {
	const debouncedQuery = useDebouncedValue(query.trim(), 400);
	const params: SearchLocationsQuery = { query: debouncedQuery, ...bias };

	return useQuery({
		queryKey: queryKeys.locations.search({ ...params }),
		queryFn: () => search(params),
		enabled: debouncedQuery.length >= 3 && debouncedQuery !== options.skipValue,
		staleTime: 5 * 60 * 1000,
	});
}
