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
import { useRecoveryReset } from "../hooks/use-recovery-reset";
import type { RecoveryResetFormValues } from "../schemas/recovery-reset.schema";
import { recoveryResetSchema } from "../schemas/recovery-reset.schema";

interface RecoveryResetFormProps {
	email?: string;
	onSuccess?: () => void;
}

export function RecoveryResetForm({
	email,
	onSuccess,
}: RecoveryResetFormProps) {
	const { register, handleSubmit, formState } =
		useForm<RecoveryResetFormValues>({
			resolver: zodResolver(recoveryResetSchema),
			defaultValues: {
				email: email ?? "",
				otp: "",
				newPassword: "",
				confirmPassword: "",
			},
		});
	const recoveryReset = useRecoveryReset();

	const onSubmit = handleSubmit((values) => {
		recoveryReset.mutate(values, { onSuccess });
	});

	return (
		<form onSubmit={onSubmit} noValidate>
			<FieldGroup>
				<Field data-invalid={!!formState.errors.email}>
					<FieldLabel htmlFor="recovery-reset-email">
						Correo electrónico
					</FieldLabel>
					<FieldContent>
						<Input
							id="recovery-reset-email"
							type="email"
							autoComplete="email"
							aria-invalid={!!formState.errors.email}
							{...register("email")}
						/>
						<FieldError errors={[formState.errors.email]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.otp}>
					<FieldLabel htmlFor="recovery-reset-otp">
						Código de verificación
					</FieldLabel>
					<FieldContent>
						<Input
							id="recovery-reset-otp"
							inputMode="numeric"
							autoComplete="one-time-code"
							maxLength={6}
							aria-invalid={!!formState.errors.otp}
							{...register("otp")}
						/>
						<FieldError errors={[formState.errors.otp]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.newPassword}>
					<FieldLabel htmlFor="recovery-reset-new-password">
						Nueva contraseña
					</FieldLabel>
					<FieldContent>
						<Input
							id="recovery-reset-new-password"
							type="password"
							autoComplete="new-password"
							aria-invalid={!!formState.errors.newPassword}
							{...register("newPassword")}
						/>
						<FieldError errors={[formState.errors.newPassword]} />
					</FieldContent>
				</Field>

				<Field data-invalid={!!formState.errors.confirmPassword}>
					<FieldLabel htmlFor="recovery-reset-confirm-password">
						Confirmar nueva contraseña
					</FieldLabel>
					<FieldContent>
						<Input
							id="recovery-reset-confirm-password"
							type="password"
							autoComplete="new-password"
							aria-invalid={!!formState.errors.confirmPassword}
							{...register("confirmPassword")}
						/>
						<FieldError errors={[formState.errors.confirmPassword]} />
					</FieldContent>
				</Field>

				{recoveryReset.isError && (
					<FieldError>{getErrorMessage(recoveryReset.error)}</FieldError>
				)}

				<Button type="submit" disabled={recoveryReset.isPending}>
					{recoveryReset.isPending
						? "Actualizando..."
						: "Actualizar contraseña"}
				</Button>
			</FieldGroup>
		</form>
	);
}
