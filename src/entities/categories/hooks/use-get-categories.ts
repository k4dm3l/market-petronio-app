import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findAll } from "../api/categories";
import type { FindCategoriesQuery } from "../model/types";

export function useGetCategories(query: FindCategoriesQuery = {}) {
	return useQuery({
		queryKey: queryKeys.categories.list({ ...query }),
		queryFn: () => findAll(query),
	});
}
