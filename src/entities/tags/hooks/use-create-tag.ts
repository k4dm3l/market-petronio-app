import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys, queryKeys } from "@/shared/config";
import { create } from "../api/tags";
import type { CreateTagDto } from "../model/types";

/** Idempotent on the server — safe to call for a tag that already exists. */
export function useCreateTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: mutationKeys.tags.create(),
		mutationFn: (payload: CreateTagDto) => create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tags.all() });
		},
	});
}
