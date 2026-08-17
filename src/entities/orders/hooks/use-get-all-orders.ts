import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";

export function useGetAllOrders(search = "") {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const params = debouncedSearch ? { search: debouncedSearch } : undefined;

	return useQuery({
		queryKey: queryKeys.orders.listAdmin(params),
		queryFn: () => listOrders(params),
	});
}
