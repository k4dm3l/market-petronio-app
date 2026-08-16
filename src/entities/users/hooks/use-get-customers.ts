import { useQuery } from "@tanstack/react-query";
import { listCustomers } from "@/entities/admin";
import { queryKeys } from "@/shared/config";

export function useGetCustomers() {
	return useQuery({
		queryKey: queryKeys.users.customers(),
		queryFn: listCustomers,
	});
}
