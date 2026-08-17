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

/** Debounced per the API's own guidance (300–500ms). */
export function useSearchLocations(query: string, bias: LocationBias = {}) {
	const debouncedQuery = useDebouncedValue(query.trim(), 400);
	const params: SearchLocationsQuery = { query: debouncedQuery, ...bias };

	return useQuery({
		queryKey: queryKeys.locations.search({ ...params }),
		queryFn: () => search(params),
		enabled: debouncedQuery.length >= 3,
		staleTime: 5 * 60 * 1000,
	});
}
