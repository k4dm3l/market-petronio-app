import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { update } from "../api/categories";

export function useSetCategoryActive() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			update(id, { isActive }),
		onSuccess: (category) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.categories.listAdmin(),
			});
			toast.success(
				category.isActive ? "Categoría activada" : "Categoría desactivada",
			);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
