import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { deleteAddress } from "../api/users";

export function useDeleteAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (addressId: string) => deleteAddress(addressId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
			toast.success("Dirección eliminada");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
