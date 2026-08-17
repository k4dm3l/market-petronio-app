import { useMutation } from "@tanstack/react-query";
import type { LoginDto } from "@/entities/auth";
import { login } from "@/entities/auth";
import { useAuth } from "@/entities/session";
import { mutationKeys } from "@/shared/config";

export function useLogin() {
	const { signIn } = useAuth();

	return useMutation({
		mutationKey: mutationKeys.auth.login(),
		mutationFn: (payload: LoginDto) => login(payload),
		onSuccess: (data) => {
			signIn({
				user: data.user,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				cook: data.cook,
			});
		},
	});
}
