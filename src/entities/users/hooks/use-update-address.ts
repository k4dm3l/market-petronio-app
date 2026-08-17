import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { updateAddress } from "../api/users";
import type { UpdateAddressDto } from "../model/types";

export function useUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			addressId,
			payload,
		}: {
			addressId: string;
			payload: UpdateAddressDto;
		}) => updateAddress(addressId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
			toast.success("Dirección actualizada");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
