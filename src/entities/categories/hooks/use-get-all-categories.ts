import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/entities/admin";
import { queryKeys } from "@/shared/config";

export function useGetAllCategories() {
	return useQuery({
		queryKey: queryKeys.categories.listAdmin(),
		queryFn: listCategories,
	});
}
