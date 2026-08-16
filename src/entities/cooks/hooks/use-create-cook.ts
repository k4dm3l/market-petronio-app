import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutationKeys, queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { create } from "../api/cooks";
import type { CreateCookDto } from "../model/types";

export function useCreateCook() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: mutationKeys.cooks.create(),
		mutationFn: (payload: CreateCookDto) => create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cooks.listAdmin() });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.customers() });
			toast.success("Cocinero creado correctamente");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
