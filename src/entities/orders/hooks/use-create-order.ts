import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "@/shared/config";
import { create } from "../api/orders";
import type { CreateOrderDto } from "../model/types";

export function useCreateOrder() {
	return useMutation({
		mutationKey: mutationKeys.orders.create(),
		mutationFn: (payload: CreateOrderDto) => create(payload),
	});
}
