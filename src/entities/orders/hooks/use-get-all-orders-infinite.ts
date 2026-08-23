import { useInfiniteQuery } from "@tanstack/react-query";
import { listOrdersPage } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";
import type { OrderStatus } from "../model/types";

interface UseGetAllOrdersInfiniteParams {
	status?: OrderStatus;
	search?: string;
}

// Status and search are filtered server-side (GET /api/admin/orders), so
// this only fetches the pages matching the current filters.
export function useGetAllOrdersInfinite({
	status,
	search = "",
}: UseGetAllOrdersInfiniteParams = {}) {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const params = {
		...(status ? { status } : {}),
		...(debouncedSearch ? { search: debouncedSearch } : {}),
	};

	return useInfiniteQuery({
		queryKey: queryKeys.orders.listAdminInfinite(params),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			listOrdersPage({ ...params, cursor: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? (lastPage.pagination.nextCursor ?? undefined)
				: undefined,
	});
}
