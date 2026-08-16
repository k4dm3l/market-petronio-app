import { http } from "@/shared/lib/http";

// The API doesn't document a response schema for the notification inbox.
export function findAll(): Promise<unknown> {
	return http.get("/api/notifications").then((res) => res.data);
}
