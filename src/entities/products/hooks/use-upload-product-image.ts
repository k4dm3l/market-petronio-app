import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutationKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { uploadImage } from "../api/products";

export function useUploadProductImage() {
	return useMutation({
		mutationKey: mutationKeys.products.uploadImage(),
		mutationFn: (file: File) => uploadImage(file),
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
