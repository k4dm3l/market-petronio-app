import { useMutation } from "@tanstack/react-query";
import type { RegisterDto } from "@/entities/auth";
import { register } from "@/entities/auth";
import { useAuth } from "@/entities/session";
import { mutationKeys } from "@/shared/config";

export function useRegister() {
	const { signIn } = useAuth();

	return useMutation({
		mutationKey: mutationKeys.auth.register(),
		mutationFn: (payload: RegisterDto) => register(payload),
		onSuccess: (data) => {
			signIn({
				user: data.user,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
			});
		},
	});
}
