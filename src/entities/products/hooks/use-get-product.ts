import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findOne } from "../api/products";

export function useGetProduct(id: string) {
	return useQuery({
		queryKey: queryKeys.products.detail(id),
		queryFn: () => findOne(id),
		enabled: Boolean(id),
	});
}
