import type { ReactNode } from "react";
import { Navigate } from "react-router";
import type { Role } from "@/entities/session";
import { useAuth } from "@/entities/session";
import { homePathForRole } from "./role-home";

interface RequireRoleProps {
	roles: Role[];
	children: ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
	const { status, role } = useAuth();

	if (status !== "authenticated") {
		return <Navigate to="/login" replace />;
	}

	if (!role || !roles.includes(role)) {
		return <Navigate to={homePathForRole(role)} replace />;
	}

	return children;
}
