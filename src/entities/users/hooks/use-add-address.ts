import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutationKeys, queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { addAddress } from "../api/users";
import type { CreateAddressDto } from "../model/types";

export function useAddAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: mutationKeys.users.addAddress(),
		mutationFn: (payload: CreateAddressDto) => addAddress(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
			toast.success("Dirección agregada");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
