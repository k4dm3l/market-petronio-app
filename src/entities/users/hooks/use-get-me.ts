import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { getMe } from "../api/users";

export function useGetMe() {
	return useQuery({
		queryKey: queryKeys.users.me(),
		queryFn: getMe,
	});
}
