import { http } from "@/shared/lib/http";
import type {
	AuthSessionResponseDto,
	LoginDto,
	PasswordRecoveryRequestDto,
	PasswordRecoveryRequestResponseDto,
	PasswordRecoveryResetDto,
	PasswordRecoveryResetResponseDto,
	PromoteAdminDto,
	RefreshTokenDto,
	RefreshTokenResponseDto,
	RegisterDto,
} from "../model/types";

export function register(
	payload: RegisterDto,
): Promise<AuthSessionResponseDto> {
	return http
		.post<AuthSessionResponseDto>("/api/auth/register", payload)
		.then((res) => res.data);
}

export function login(payload: LoginDto): Promise<AuthSessionResponseDto> {
	return http
		.post<AuthSessionResponseDto>("/api/auth/login", payload)
		.then((res) => res.data);
}

export function refresh(
	payload: RefreshTokenDto,
): Promise<RefreshTokenResponseDto> {
	return http
		.post<RefreshTokenResponseDto>("/api/auth/refresh", payload)
		.then((res) => res.data);
}

export function requestPasswordRecovery(
	payload: PasswordRecoveryRequestDto,
): Promise<PasswordRecoveryRequestResponseDto> {
	return http
		.post<PasswordRecoveryRequestResponseDto>(
			"/api/auth/password-recovery/request",
			payload,
		)
		.then((res) => res.data);
}

export function resetPassword(
	payload: PasswordRecoveryResetDto,
): Promise<PasswordRecoveryResetResponseDto> {
	return http
		.post<PasswordRecoveryResetResponseDto>(
			"/api/auth/password-recovery/reset",
			payload,
		)
		.then((res) => res.data);
}

export function promoteAdmin(payload: PromoteAdminDto): Promise<unknown> {
	return http.post("/api/auth/promote-admin", payload).then((res) => res.data);
}
