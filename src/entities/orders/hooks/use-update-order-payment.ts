import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { updatePayment } from "../api/orders";
import type { UpdatePaymentDto } from "../model/types";

export function useUpdateOrderPayment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdatePaymentDto }) =>
			updatePayment(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
