import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";
import { findAll } from "../api/cooks";
import type { FindCooksQuery } from "../model/types";

interface UseSearchCooksParams {
	search?: string;
	specialties?: string[];
	limit?: number;
}

/** Public catalog (GET /api/cooks) — customer browsing. Search and specialty filtering are applied server-side. */
export function useSearchCooks({
	search = "",
	specialties = [],
	limit = 60,
}: UseSearchCooksParams = {}) {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);

	const query: FindCooksQuery = {
		limit,
		...(debouncedSearch ? { search: debouncedSearch } : {}),
		...(specialties.length > 0 ? { specialties: specialties.join(",") } : {}),
	};

	return useQuery({
		queryKey: queryKeys.cooks.list({ ...query }),
		queryFn: () => findAll(query),
	});
}
