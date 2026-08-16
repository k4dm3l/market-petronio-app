import { Link, useNavigate } from "react-router";
import { LoginForm } from "@/features/auth";
import { AuthLayout } from "./auth-layout";

export function LoginPage() {
	const navigate = useNavigate();

	return (
		<AuthLayout
			title="¡Qué alegría verte de nuevo!"
			description="Inicia sesión para seguir disfrutando de los sabores del Pacífico."
			footer={
				<span>
					¿No tienes cuenta?{" "}
					<Link
						to="/register"
						className="font-medium text-accent hover:text-accent/80"
					>
						Regístrate
					</Link>
				</span>
			}
		>
			<LoginForm onSuccess={() => navigate("/", { replace: true })} />
		</AuthLayout>
	);
}
