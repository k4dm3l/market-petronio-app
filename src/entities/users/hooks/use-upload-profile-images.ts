import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys, queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { uploadImage } from "../api/users";

export interface UploadProfileImageResult {
	file: File;
	url?: string;
	error?: string;
}

/**
 * Uploads every file concurrently and never rejects: each file's outcome is
 * reported individually so a caller uploading several candidates at once can
 * show a per-file success/error state instead of failing the whole batch.
 */
export function useUploadProfileImages() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: mutationKeys.users.uploadProfileImages(),
		mutationFn: async (files: File[]): Promise<UploadProfileImageResult[]> => {
			const settled = await Promise.allSettled(
				files.map((file) => uploadImage(file)),
			);
			return settled.map((result, index) => ({
				file: files[index],
				url: result.status === "fulfilled" ? result.value.url : undefined,
				error:
					result.status === "rejected"
						? getErrorMessage(result.reason)
						: undefined,
			}));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
		},
	});
}
