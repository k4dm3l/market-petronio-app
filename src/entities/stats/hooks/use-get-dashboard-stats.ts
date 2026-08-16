import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { getDashboardStats } from "../api/stats";

export function useGetDashboardStats() {
	return useQuery({
		queryKey: queryKeys.stats.dashboard(),
		queryFn: getDashboardStats,
	});
}
