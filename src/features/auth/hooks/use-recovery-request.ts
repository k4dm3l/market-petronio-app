import { useMutation } from "@tanstack/react-query";
import type { PasswordRecoveryRequestDto } from "@/entities/auth";
import { requestPasswordRecovery } from "@/entities/auth";
import { mutationKeys } from "@/shared/config";

export function useRecoveryRequest() {
	return useMutation({
		mutationKey: mutationKeys.auth.recoveryRequest(),
		mutationFn: (payload: PasswordRecoveryRequestDto) =>
			requestPasswordRecovery(payload),
	});
}
