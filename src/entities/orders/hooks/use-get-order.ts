import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findOne } from "../api/orders";

export function useGetOrder(id: string) {
	return useQuery({
		queryKey: queryKeys.orders.detail(id),
		queryFn: () => findOne(id),
		enabled: Boolean(id),
	});
}
