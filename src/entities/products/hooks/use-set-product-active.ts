import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SetActiveDto } from "@/entities/admin";
import { setProductActive } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";

export function useSetProductActive() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: SetActiveDto }) =>
			setProductActive(id, payload),
		onSuccess: (product) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.products.listAdmin(),
			});
			toast.success(
				product.isActive ? "Producto activado" : "Producto desactivado",
			);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
