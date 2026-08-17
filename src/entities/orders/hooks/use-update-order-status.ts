import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
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
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
