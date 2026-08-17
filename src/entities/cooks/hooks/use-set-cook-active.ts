import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SetActiveDto } from "@/entities/admin";
import { setCookActive } from "@/entities/admin";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";

export function useSetCookActive() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: SetActiveDto }) =>
			setCookActive(id, payload),
		onSuccess: (cook) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cooks.listAdmin() });
			toast.success(
				cook.isActive ? "Cocinero activado" : "Cocinero desactivado",
			);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
