import { useMutation } from "@tanstack/react-query";
import type { PasswordRecoveryResetDto } from "@/entities/auth";
import { resetPassword } from "@/entities/auth";
import { mutationKeys } from "@/shared/config";

export function useRecoveryReset() {
	return useMutation({
		mutationKey: mutationKeys.auth.recoveryReset(),
		mutationFn: (payload: PasswordRecoveryResetDto) => resetPassword(payload),
	});
}
