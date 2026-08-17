import { useQuery } from "@tanstack/react-query";
import { listCooks } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";

export function useGetAllCooks(search = "") {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const params = debouncedSearch ? { search: debouncedSearch } : undefined;

	return useQuery({
		queryKey: queryKeys.cooks.listAdmin(params),
		queryFn: () => listCooks(params),
	});
}
