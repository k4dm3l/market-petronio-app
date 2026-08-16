import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutationKeys, queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { create } from "../api/categories";
import type { CreateCategoryDto } from "../model/types";

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: mutationKeys.categories.create(),
		mutationFn: (payload: CreateCategoryDto) => create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.categories.listAdmin(),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.categories.list(),
			});
			toast.success("Categoría creada correctamente");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
