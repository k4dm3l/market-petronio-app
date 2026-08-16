import { isAxiosError } from "axios";

export function getErrorMessage(
	error: unknown,
	fallback = "Ocurrió un error inesperado. Intenta de nuevo.",
): string {
	if (isAxiosError(error)) {
		const message = (error.response?.data as { message?: unknown } | undefined)
			?.message;
		if (typeof message === "string") return message;
		if (Array.isArray(message) && typeof message[0] === "string")
			return message[0];
	}
	if (error instanceof Error) return error.message;
	return fallback;
}
