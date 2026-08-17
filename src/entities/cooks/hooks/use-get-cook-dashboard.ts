import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { dashboard } from "../api/cooks";

export function useGetCookDashboard() {
	return useQuery({
		queryKey: queryKeys.cooks.dashboard(),
		queryFn: dashboard,
	});
}
