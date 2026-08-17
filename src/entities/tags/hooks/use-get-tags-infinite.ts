import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { useDebouncedValue } from "@/shared/hooks";
import { findAllPage } from "../api/tags";

export function useGetTagsInfinite(search = "") {
	const debouncedSearch = useDebouncedValue(search.trim(), 400);
	const baseParams = debouncedSearch ? { search: debouncedSearch } : undefined;

	return useInfiniteQuery({
		queryKey: queryKeys.tags.listInfinite(baseParams),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			findAllPage({ ...baseParams, cursor: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? (lastPage.pagination.nextCursor ?? undefined)
				: undefined,
	});
}
