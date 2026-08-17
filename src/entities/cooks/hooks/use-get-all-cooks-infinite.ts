import { useInfiniteQuery } from "@tanstack/react-query";
import { listCooksPage } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";

export function useGetAllCooksInfinite(search = "") {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const baseParams = debouncedSearch ? { search: debouncedSearch } : undefined;

	return useInfiniteQuery({
		queryKey: queryKeys.cooks.listAdminInfinite(baseParams),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			listCooksPage({ ...baseParams, cursor: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? (lastPage.pagination.nextCursor ?? undefined)
				: undefined,
	});
}
