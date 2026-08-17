import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findAll } from "../api/products";
import type { FindProductsQuery } from "../model/types";

/** Public catalog (GET /api/products) — for the customer-facing search page. */
export function useGetProducts(query: FindProductsQuery = {}) {
	return useQuery({
		queryKey: queryKeys.products.list({ ...query }),
		queryFn: () => findAll(query),
	});
}
