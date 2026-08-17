import type { AuthUserDto } from "@/entities/auth";
import type { Cook } from "@/entities/cooks";
import { UserRole } from "@/entities/users";

export const Role = UserRole;
export type Role = UserRole;
export type User = AuthUserDto;

export interface Session {
	user: User;
	accessToken: string;
	refreshToken?: string;
	/** Only set when `user.role` is "cook" — that user's own cook profile. */
	cook?: Cook;
}
