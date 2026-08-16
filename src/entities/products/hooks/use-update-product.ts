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
			queryClient.invalidateQueries({
				queryKey: queryKeys.products.listAdmin(),
			});
			toast.success("Producto actualizado correctamente");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
