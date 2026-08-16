import { http } from "@/shared/lib/http";
import type {
	Category,
	CreateCategoryDto,
	UpdateCategoryDto,
} from "../model/types";

export function findAll(): Promise<Category[]> {
	return http.get<Category[]>("/api/categories").then((res) => res.data);
}

export function findAllAdmin(): Promise<Category[]> {
	return http.get<Category[]>("/api/categories/all").then((res) => res.data);
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
