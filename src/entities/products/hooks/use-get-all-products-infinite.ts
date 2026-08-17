import { useInfiniteQuery } from "@tanstack/react-query";
import { listProductsPage } from "@/entities/admin";
import { queryKeys } from "@/shared/config";

/**
 * No `search` param — /api/admin/products only supports limit/cursor, so
 * text search stays client-side over whatever pages have been loaded.
 */
export function useGetAllProductsInfinite() {
	return useInfiniteQuery({
		queryKey: queryKeys.products.listAdminInfinite(),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			listProductsPage({ cursor: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? (lastPage.pagination.nextCursor ?? undefined)
				: undefined,
	});
}
