import { Link, useNavigate } from "react-router";
import { RecoveryRequestForm } from "@/features/auth";
import { AuthLayout } from "./auth-layout";

export function RecoveryRequestPage() {
	const navigate = useNavigate();

	return (
		<AuthLayout
			title="Recuperar contraseña"
			description="Te enviaremos un código de verificación a tu correo."
			footer={
				<Link
					to="/login"
					className="font-medium text-accent hover:text-accent/80"
				>
					Volver a iniciar sesión
				</Link>
			}
		>
			<RecoveryRequestForm
				onSuccess={(email) => navigate("/recovery/reset", { state: { email } })}
			/>
		</AuthLayout>
	);
}
