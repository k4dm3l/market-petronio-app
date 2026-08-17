import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { promoteAdmin } from "@/entities/auth";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";

export function usePromoteAdmin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => promoteAdmin({ userId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.customers() });
			toast.success("Cliente convertido en administrador");
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
}
