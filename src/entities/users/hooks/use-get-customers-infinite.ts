import { useInfiniteQuery } from "@tanstack/react-query";
import { listCustomersPage } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";

export function useGetCustomersInfinite(search = "") {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const baseParams = debouncedSearch ? { search: debouncedSearch } : undefined;

	return useInfiniteQuery({
		queryKey: queryKeys.users.customersInfinite(baseParams),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			listCustomersPage({ ...baseParams, cursor: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? (lastPage.pagination.nextCursor ?? undefined)
				: undefined,
	});
}
