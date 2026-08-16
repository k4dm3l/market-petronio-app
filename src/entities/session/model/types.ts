import type { AuthUserDto } from "@/entities/auth";
import { UserRole } from "@/entities/users";

export const Role = UserRole;
export type Role = UserRole;
export type User = AuthUserDto;

export interface Session {
	user: User;
	accessToken: string;
	refreshToken?: string;
}
