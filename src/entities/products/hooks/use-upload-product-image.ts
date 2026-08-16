import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { uploadImage } from "../api/products";

export function useUploadProductImage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) =>
			uploadImage(id, file),
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
