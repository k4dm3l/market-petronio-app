import { Role } from "@/entities/session";

export function homePathForRole(role: Role | null): string {
	switch (role) {
		case Role.Admin:
			return "/admin/users";
		case Role.Cook:
			return "/orders";
		case Role.Customer:
			return "/search";
		default:
			return "/login";
	}
}
