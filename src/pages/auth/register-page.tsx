import { Link, useNavigate } from "react-router";
import { RegisterForm } from "@/features/auth";
import { AuthLayout } from "./auth-layout";

export function RegisterPage() {
	const navigate = useNavigate();

	return (
		<AuthLayout
			title="Crea tu cuenta"
			description="Regístrate para empezar a comprar en Petronio Market."
			footer={
				<span>
					¿Ya tienes cuenta?{" "}
					<Link
						to="/login"
						className="font-medium text-accent hover:text-accent/80"
					>
						Inicia sesión
					</Link>
				</span>
			}
		>
			<RegisterForm onSuccess={() => navigate("/", { replace: true })} />
		</AuthLayout>
	);
}
