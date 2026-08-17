import type { PaginatedResponseDto } from "@/shared/lib/pagination";
import { http } from "@/shared/lib/http";
import type {
	Category,
	CreateCategoryDto,
	FindCategoriesQuery,
	UpdateCategoryDto,
} from "../model/types";

export function findAll(
	query: FindCategoriesQuery = {},
): Promise<Category[]> {
	return http
		.get<PaginatedResponseDto<Category>>("/api/categories", { params: query })
		.then((res) => res.data.data);
}

export function findAllAdmin(
	query: FindCategoriesQuery = {},
): Promise<Category[]> {
	return http
		.get<PaginatedResponseDto<Category>>("/api/categories/all", {
			params: query,
		})
		.then((res) => res.data.data);
}

export function findOne(id: string): Promise<Category> {
	return http.get<Category>(`/api/categories/${id}`).then((res) => res.data);
}

export function create(payload: CreateCategoryDto): Promise<Category> {
	return http
		.post<Category>("/api/categories", payload)
		.then((res) => res.data);
}

export function update(
	id: string,
	payload: UpdateCategoryDto,
): Promise<Category> {
	return http
		.patch<Category>(`/api/categories/${id}`, payload)
		.then((res) => res.data);
}
