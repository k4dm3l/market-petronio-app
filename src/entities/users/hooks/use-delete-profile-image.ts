import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutationKeys, queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { deleteImage } from "../api/users";

export function useDeleteProfileImage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: mutationKeys.users.deleteProfileImage(),
		mutationFn: () => deleteImage(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
