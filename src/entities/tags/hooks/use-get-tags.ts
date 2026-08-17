import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findAll } from "../api/tags";
import type { FindTagsQuery } from "../model/types";

export function useGetTags(query: FindTagsQuery = {}) {
	return useQuery({
		queryKey: queryKeys.tags.list(query as Record<string, unknown>),
		queryFn: () => findAll(query),
	});
}
