import { http } from "@/shared/lib/http";
import type { PaginatedResponseDto } from "@/shared/lib/pagination";
import type {
	Cook,
	CookDashboardResponseDto,
	CreateCookDto,
	FindCooksQuery,
	UpdateCookDto,
} from "../model/types";

export function findAll(query: FindCooksQuery = {}): Promise<Cook[]> {
	return http
		.get<PaginatedResponseDto<Cook>>("/api/cooks", { params: query })
		.then((res) => res.data.data);
}

export function findOne(id: string): Promise<Cook> {
	return http.get<Cook>(`/api/cooks/${id}`).then((res) => res.data);
}

export function create(payload: CreateCookDto): Promise<Cook> {
	return http.post<Cook>("/api/cooks", payload).then((res) => res.data);
}

export function update(id: string, payload: UpdateCookDto): Promise<Cook> {
	return http.patch<Cook>(`/api/cooks/${id}`, payload).then((res) => res.data);
}

export function dashboard(): Promise<CookDashboardResponseDto> {
	return http
		.get<CookDashboardResponseDto>("/api/cooks/me/dashboard")
		.then((res) => res.data);
}
