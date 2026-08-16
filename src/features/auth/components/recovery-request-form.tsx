import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { getErrorMessage } from "@/shared/lib/error";
import { useRecoveryRequest } from "../hooks/use-recovery-request";
import type { RecoveryRequestFormValues } from "../schemas/recovery-request.schema";
import { recoveryRequestSchema } from "../schemas/recovery-request.schema";

interface RecoveryRequestFormProps {
	onSuccess?: (email: string) => void;
}

export function RecoveryRequestForm({ onSuccess }: RecoveryRequestFormProps) {
	const { register, handleSubmit, formState } =
		useForm<RecoveryRequestFormValues>({
			resolver: zodResolver(recoveryRequestSchema),
			defaultValues: { email: "" },
		});
	const recoveryRequest = useRecoveryRequest();

	const onSubmit = handleSubmit((values) => {
		recoveryRequest.mutate(values, {
			onSuccess: () => onSuccess?.(values.email),
		});
	});

	if (recoveryRequest.isSuccess) {
		return <FieldDescription>{recoveryRequest.data.message}</FieldDescription>;
	}

	return (
		<form onSubmit={onSubmit} noValidate>
			<FieldGroup>
				<Field data-invalid={!!formState.errors.email}>
					<FieldLabel htmlFor="recovery-request-email">
						Correo electrónico
					</FieldLabel>
					<FieldContent>
						<Input
							id="recovery-request-email"
							type="email"
							autoComplete="email"
							aria-invalid={!!formState.errors.email}
							{...register("email")}
						/>
						<FieldError errors={[formState.errors.email]} />
					</FieldContent>
				</Field>

				{recoveryRequest.isError && (
					<FieldError>{getErrorMessage(recoveryRequest.error)}</FieldError>
				)}

				<Button type="submit" disabled={recoveryRequest.isPending}>
					{recoveryRequest.isPending ? "Enviando..." : "Enviar código"}
				</Button>
			</FieldGroup>
		</form>
	);
}
