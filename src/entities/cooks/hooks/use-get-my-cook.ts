import { useAuth } from "@/entities/session";
import { useGetCooks } from "./use-get-cooks";

/**
 * Resolves the logged-in cook's own profile. There's no "GET /api/cooks/me"
 * endpoint, so this looks the user up by userId in the public cook list
 * (capped at 100 — fine for now, but won't scale past that many cooks).
 */
export function useGetMyCook() {
	const { user } = useAuth();
	const { data: cooks, isPending, isError } = useGetCooks({ limit: 100 });
	const cook = cooks?.find((candidate) => candidate.userId === user?.id);

	return { data: cook, isPending, isError };
}
