import type { Category } from "@/entities/categories";
import type { Cook } from "@/entities/cooks";
import type { OrderResponseDto } from "@/entities/orders";
import type { Product } from "@/entities/products";
import type { UserMeResponseDto } from "@/entities/users";
import { http } from "@/shared/lib/http";
import type {
	AdminOrdersQuery,
	AdminSearchQuery,
	PaginatedResponseDto,
	SetActiveDto,
} from "../model/types";

export function listCustomers(
	query: AdminSearchQuery = {},
): Promise<UserMeResponseDto[]> {
	return http
		.get<PaginatedResponseDto<UserMeResponseDto>>("/api/admin/customers", {
			params: query,
		})
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

export function listCooks(query: AdminSearchQuery = {}): Promise<Cook[]> {
	return http
		.get<PaginatedResponseDto<Cook>>("/api/admin/cooks", { params: query })
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

// No `search` param on this one — GET /api/admin/products only takes
// limit/cursor per the API spec, so the admin products page still filters
// client-side.
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

export function listOrders(
	query: AdminOrdersQuery = {},
): Promise<OrderResponseDto[]> {
	return http
		.get<PaginatedResponseDto<OrderResponseDto>>("/api/admin/orders", {
			params: query,
		})
		.then((res) => res.data.data);
}

export function listCategories(
	query: AdminSearchQuery = {},
): Promise<Category[]> {
	return http
		.get<PaginatedResponseDto<Category>>("/api/admin/categories", {
			params: query,
		})
		.then((res) => res.data.data);
}
