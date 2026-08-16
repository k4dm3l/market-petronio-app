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
			queryClient.invalidateQueries({
				queryKey: queryKeys.products.listAdmin(),
			});
			toast.success("Producto creado correctamente");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
