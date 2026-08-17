import { useQuery } from "@tanstack/react-query";
import { listCustomers } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";

export function useGetCustomers(search = "") {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const params = debouncedSearch ? { search: debouncedSearch } : undefined;

	return useQuery({
		queryKey: queryKeys.users.customers(params),
		queryFn: () => listCustomers(params),
	});
}
