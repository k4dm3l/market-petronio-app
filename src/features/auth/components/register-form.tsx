import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useRegister } from "../hooks/use-register";
import type { RegisterFormValues } from "../schemas/register.schema";
import { registerSchema } from "../schemas/register.schema";

interface RegisterFormProps {
	onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
	const { register, handleSubmit, formState } = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
	});
	const registerMutation = useRegister();

	const onSubmit = handleSubmit((values) => {
		registerMutation.mutate(
			{ name: values.name, email: values.email, password: values.password },
			{ onSuccess },
		);
	});

	return (
		<form onSubmit={onSubmit} noValidate>
			<FieldGroup>
				<Field data-invalid={!!formState.errors.name}>
					<FieldLabel htmlFor="register-name">Nombre completo</FieldLabel>
					<FieldContent>
						<Input
							id="register-name"
							autoComplete="name"
							aria-invalid={!!formState.errors.name}
							{...register("name")}
						/>
						<FieldError errors={[formState.errors.name]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.email}>
					<FieldLabel htmlFor="register-email">Correo electrónico</FieldLabel>
					<FieldContent>
						<Input
							id="register-email"
							type="email"
							autoComplete="email"
							aria-invalid={!!formState.errors.email}
							{...register("email")}
						/>
						<FieldError errors={[formState.errors.email]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.password}>
					<FieldLabel htmlFor="register-password">Contraseña</FieldLabel>
					<FieldContent>
						<Input
							id="register-password"
							type="password"
							autoComplete="new-password"
							aria-invalid={!!formState.errors.password}
							{...register("password")}
						/>
						<FieldError errors={[formState.errors.password]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.confirmPassword}>
					<FieldLabel htmlFor="register-confirm-password">
						Confirmar contraseña
					</FieldLabel>
					<FieldContent>
						<Input
							id="register-confirm-password"
							type="password"
							autoComplete="new-password"
							aria-invalid={!!formState.errors.confirmPassword}
							{...register("confirmPassword")}
						/>
						<FieldError errors={[formState.errors.confirmPassword]} />
					</FieldContent>
				</Field>

				{registerMutation.isError && (
					<FieldError>{getErrorMessage(registerMutation.error)}</FieldError>
				)}

				<Button type="submit" disabled={registerMutation.isPending}>
					{registerMutation.isPending ? "Creando cuenta..." : "Crear cuenta"}
				</Button>
			</FieldGroup>
		</form>
	);
}
