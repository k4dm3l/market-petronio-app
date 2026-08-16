import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findAll } from "../api/categories";

export function useGetCategories() {
	return useQuery({
		queryKey: queryKeys.categories.list(),
		queryFn: findAll,
	});
}
