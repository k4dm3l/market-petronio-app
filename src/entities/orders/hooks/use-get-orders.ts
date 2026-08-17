import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findAll } from "../api/orders";
import type { FindOrdersQuery } from "../model/types";

export function useGetOrders(query: FindOrdersQuery = {}) {
	return useQuery({
		queryKey: queryKeys.orders.list(query as Record<string, unknown>),
		queryFn: async () => {
			const response = await findAll(query);
			return response.data;
		},
	});
}
