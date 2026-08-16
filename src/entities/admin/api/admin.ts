import type { Category } from "@/entities/categories";
import type { Cook } from "@/entities/cooks";
import type { OrderResponseDto } from "@/entities/orders";
import type { Product } from "@/entities/products";
import type { UserMeResponseDto } from "@/entities/users";
import { http } from "@/shared/lib/http";
import type { PaginatedResponseDto, SetActiveDto } from "../model/types";

export function listCustomers(): Promise<UserMeResponseDto[]> {
	return http
		.get<PaginatedResponseDto<UserMeResponseDto>>("/api/admin/customers")
		.then((res) => res.data.data);
}

export function setCustomerActive(
	id: string,
	payload: SetActiveDto,
): Promise<UserMeResponseDto> {
	return http
		.patch<UserMeResponseDto>(`/api/admin/customers/${id}`, payload)
		.then((res) => res.data);
}

export function listCooks(): Promise<Cook[]> {
	return http
		.get<PaginatedResponseDto<Cook>>("/api/admin/cooks")
		.then((res) => res.data.data);
}

export function setCookActive(
	id: string,
	payload: SetActiveDto,
): Promise<Cook> {
	return http
		.patch<Cook>(`/api/admin/cooks/${id}`, payload)
		.then((res) => res.data);
}

export function listProducts(): Promise<Product[]> {
	return http
		.get<PaginatedResponseDto<Product>>("/api/admin/products")
		.then((res) => res.data.data);
}

export function setProductActive(
	id: string,
	payload: SetActiveDto,
): Promise<Product> {
	return http
		.patch<Product>(`/api/admin/products/${id}`, payload)
		.then((res) => res.data);
}

export function listOrders(): Promise<OrderResponseDto[]> {
	return http
		.get<PaginatedResponseDto<OrderResponseDto>>("/api/admin/orders")
		.then((res) => res.data.data);
}

export function listCategories(): Promise<Category[]> {
	return http
		.get<PaginatedResponseDto<Category>>("/api/admin/categories")
		.then((res) => res.data.data);
}
