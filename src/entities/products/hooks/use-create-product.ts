import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutationKeys, queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { create } from "../api/products";
import type { CreateProductDto } from "../model/types";

export function useCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: mutationKeys.products.create(),
		mutationFn: (payload: CreateProductDto) => create(payload),
		onSuccess: () => {
			// Broad "products" prefix — covers the admin list and the public
			// list (customer catalog + cook's own products page) alike.
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
			toast.success("Producto creado correctamente");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
