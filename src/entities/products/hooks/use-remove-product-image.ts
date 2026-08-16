import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { removeImage } from "../api/products";

export function useRemoveProductImage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
			removeImage(id, imageId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.products.listAdmin(),
			});
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
