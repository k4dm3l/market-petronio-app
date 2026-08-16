import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/entities/admin";
import { queryKeys } from "@/shared/config";

export function useGetAllOrders() {
	return useQuery({
		queryKey: queryKeys.orders.listAdmin(),
		queryFn: listOrders,
	});
}
