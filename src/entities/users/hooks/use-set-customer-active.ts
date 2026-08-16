import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SetActiveDto } from "@/entities/admin";
import { setCustomerActive } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";

export function useSetCustomerActive() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: SetActiveDto }) =>
			setCustomerActive(id, payload),
		onSuccess: (customer) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.customers() });
			toast.success(
				customer.isActive ? "Cliente activado" : "Cliente desactivado",
			);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
