import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { updateStatus } from "../api/orders";
import type { UpdateOrderStatusDto } from "../model/types";

export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdateOrderStatusDto;
		}) => updateStatus(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
		},
	});
}
