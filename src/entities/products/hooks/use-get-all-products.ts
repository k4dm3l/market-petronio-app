import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/entities/admin";
import { queryKeys } from "@/shared/config";

export function useGetAllProducts() {
	return useQuery({
		queryKey: queryKeys.products.listAdmin(),
		queryFn: listProducts,
	});
}
