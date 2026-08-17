import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findAll } from "../api/products";
import type { FindProductsQuery } from "../model/types";

/** Public catalog (GET /api/products) — customer search and cook self-management alike. */
export function useGetProducts(
	query: FindProductsQuery = {},
	options: { enabled?: boolean } = {},
) {
	return useQuery({
		queryKey: queryKeys.products.list({ ...query }),
		queryFn: () => findAll(query),
		enabled: options.enabled,
	});
}
