import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";
import { findAll } from "../api/tags";

/** For autocomplete-style consumers: debounces `search` internally. */
export function useGetTags(search = "", limit = 8) {
	const debouncedSearch = useDebouncedValue(search.trim(), 300);
	const params = { search: debouncedSearch || undefined, limit };

	return useQuery({
		queryKey: queryKeys.tags.list(params),
		queryFn: () => findAll(params),
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
	});
}
