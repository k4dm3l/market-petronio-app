import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { updatePayment } from "../api/orders";
import type { UpdatePaymentDto } from "../model/types";

export function useUpdateOrderPayment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdatePaymentDto;
		}) => updatePayment(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
		},
	});
}
