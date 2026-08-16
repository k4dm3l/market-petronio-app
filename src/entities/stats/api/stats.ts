import { http } from "@/shared/lib/http";

// The API doesn't document a response schema for dashboard stats.
export function getDashboardStats(): Promise<unknown> {
	return http.get("/api/admin/stats").then((res) => res.data);
}
