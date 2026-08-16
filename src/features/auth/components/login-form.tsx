import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { getErrorMessage } from "@/shared/lib/error";
import { useLogin } from "../hooks/use-login";
import type { LoginFormValues } from "../schemas/login.schema";
import { loginSchema } from "../schemas/login.schema";

interface LoginFormProps {
	onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
	const { register, handleSubmit, formState } = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});
	const login = useLogin();

	const onSubmit = handleSubmit((values) => {
		login.mutate(values, { onSuccess });
	});

	return (
		<form onSubmit={onSubmit} noValidate>
			<FieldGroup>
				<Field data-invalid={!!formState.errors.email}>
					<FieldLabel htmlFor="login-email">Correo electrónico</FieldLabel>
					<FieldContent>
						<Input
							id="login-email"
							type="email"
							autoComplete="email"
							aria-invalid={!!formState.errors.email}
							{...register("email")}
						/>
						<FieldError errors={[formState.errors.email]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.password}>
					<FieldLabel htmlFor="login-password">Contraseña</FieldLabel>
					<FieldContent>
						<Input
							id="login-password"
							type="password"
							autoComplete="current-password"
							aria-invalid={!!formState.errors.password}
							{...register("password")}
						/>
						<FieldError errors={[formState.errors.password]} />
					</FieldContent>
				</Field>

				<Link
					to="/recovery"
					className="-mt-2 self-start text-sm font-medium text-accent hover:text-accent/80"
				>
					¿Olvidaste tu contraseña?
				</Link>

				{login.isError && (
					<FieldError>{getErrorMessage(login.error)}</FieldError>
				)}

				<Button type="submit" disabled={login.isPending}>
					{login.isPending ? "Ingresando..." : "Iniciar sesión"}
				</Button>
			</FieldGroup>
		</form>
	);
}
