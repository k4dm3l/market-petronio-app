import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";
import { searchLocations } from "../api/geolocation";

export function useSearchLocations(query: string) {
	const debouncedQuery = useDebouncedValue(query.trim(), 400);

	return useQuery({
		queryKey: queryKeys.geolocation.search(debouncedQuery),
		queryFn: () => searchLocations(debouncedQuery),
		enabled: debouncedQuery.length >= 3,
		staleTime: 5 * 60 * 1000,
	});
}
