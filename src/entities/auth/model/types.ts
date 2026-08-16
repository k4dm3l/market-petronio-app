import type { UserRole } from "@/entities/users";

/**
 * The `user` embedded in login/register responses — smaller than
 * UserMeResponseDto (no isActive/deliveryInformation). Verified against a
 * real response on 2026-08-15; the OpenAPI spec still doesn't document this
 * schema for either endpoint.
 */
export interface AuthUserDto {
	id: string;
	email: string;
	name: string;
	role: UserRole;
}

export interface AuthSessionResponseDto {
	accessToken: string;
	refreshToken: string;
	user: AuthUserDto;
}

export interface RegisterDto {
	email: string;
	name: string;
	/** Min 8 chars, uppercase, lowercase, number, and special character */
	password: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface RefreshTokenDto {
	refreshToken: string;
}

/**
 * The OpenAPI contract doesn't document a response schema for refresh; this
 * mirrors what the http interceptor assumes. Verify against a real response.
 */
export interface RefreshTokenResponseDto {
	accessToken: string;
	refreshToken?: string;
}

export interface PasswordRecoveryRequestDto {
	email: string;
}

export interface PasswordRecoveryRequestResponseDto {
	message: string;
}

export interface PasswordRecoveryResetDto {
	email: string;
	/** 6-digit OTP received by email (valid for 10 minutes) */
	otp: string;
	newPassword: string;
	confirmPassword: string;
}

export interface PasswordRecoveryResetResponseDto {
	message: string;
}

export interface PromoteAdminDto {
	userId: string;
}
