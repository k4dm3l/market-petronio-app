import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { update } from "../api/products";
import type { UpdateProductDto } from "../model/types";

export function useUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateProductDto }) =>
			update(id, payload),
		onSuccess: () => {
			// Broad "products" prefix — covers both the admin list and this
			// product's detail query (edit page reads via useGetProduct).
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
			toast.success("Producto actualizado correctamente");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
