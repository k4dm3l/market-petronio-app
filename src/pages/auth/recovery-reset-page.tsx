import { useLocation, useNavigate } from "react-router";
import { RecoveryResetForm } from "@/features/auth";
import { AuthLayout } from "./auth-layout";

export function RecoveryResetPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const email = (location.state as { email?: string } | null)?.email;

	return (
		<AuthLayout
			title="Restablecer contraseña"
			description="Ingresa el código que recibiste y tu nueva contraseña."
		>
			<RecoveryResetForm
				email={email}
				onSuccess={() => navigate("/login", { replace: true })}
			/>
		</AuthLayout>
	);
}
