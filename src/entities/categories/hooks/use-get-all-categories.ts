import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";

export function useGetAllCategories(search = "") {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const params = debouncedSearch ? { search: debouncedSearch } : undefined;

	return useQuery({
		queryKey: queryKeys.categories.listAdmin(params),
		queryFn: () => listCategories(params),
	});
}
