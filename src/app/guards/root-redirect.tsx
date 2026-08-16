import { Navigate } from "react-router";
import { useAuth } from "@/entities/session";
import { homePathForRole } from "./role-home";

export function RootRedirect() {
	const { status, role } = useAuth();

	if (status !== "authenticated") {
		return <Navigate to="/login" replace />;
	}

	return <Navigate to={homePathForRole(role)} replace />;
}
