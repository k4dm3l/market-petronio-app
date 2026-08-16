import { STORAGE_KEYS } from "@/shared/config";
import { Storage } from "@/shared/lib/storage";
import type { Session, User } from "./types";
import { Role } from "./types";

export function readSession(): Session | null {
	const stored = Storage.get(STORAGE_KEYS.session);
	return isSession(stored) ? stored : null;
}

export function writeSession(session: Session): void {
	Storage.set(STORAGE_KEYS.session, session);
}

export function clearSession(): void {
	Storage.clear(STORAGE_KEYS.session);
}

const ROLES: Role[] = [Role.Customer, Role.Cook, Role.Admin];

function isUser(value: unknown): value is User {
	if (typeof value !== "object" || value === null) return false;
	const { id, name, email, role } = value as Record<string, unknown>;
	return (
		typeof id === "string" &&
		typeof name === "string" &&
		typeof email === "string" &&
		typeof role === "string" &&
		ROLES.includes(role as Role)
	);
}

function isSession(value: unknown): value is Session {
	if (typeof value !== "object" || value === null) return false;
	const { user, accessToken, refreshToken } = value as Record<string, unknown>;
	return (
		typeof accessToken === "string" &&
		(refreshToken === undefined || typeof refreshToken === "string") &&
		isUser(user)
	);
}
