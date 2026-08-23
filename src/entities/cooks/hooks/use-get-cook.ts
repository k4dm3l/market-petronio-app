import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findOne } from "../api/cooks";

export function useGetCook(id?: string) {
	return useQuery({
		queryKey: queryKeys.cooks.detail(id ?? ""),
		queryFn: () => findOne(id as string),
		enabled: Boolean(id),
	});
}
