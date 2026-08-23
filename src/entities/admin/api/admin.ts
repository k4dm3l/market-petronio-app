import type { Category } from "@/entities/categories";
import type { Cook } from "@/entities/cooks";
import type { OrderResponseDto } from "@/entities/orders";
import type { Product } from "@/entities/products";
import type { UserMeResponseDto } from "@/entities/users";
import { http } from "@/shared/lib/http";
import type {
	AdminCursorQuery,
	AdminOrdersQuery,
	AdminSearchQuery,
	PaginatedResponseDto,
	SetActiveDto,
} from "../model/types";

/** Full paginated envelope — for infinite-scroll consumers that need `pagination`. */
export function listCustomersPage(
	query: AdminSearchQuery = {},
): Promise<PaginatedResponseDto<UserMeResponseDto>> {
	return http
		.get<PaginatedResponseDto<UserMeResponseDto>>("/api/admin/customers", {
			params: query,
		})
		.then((res) => res.data);
}

export function listCustomers(
	query: AdminSearchQuery = {},
): Promise<UserMeResponseDto[]> {
	return listCustomersPage(query).then((res) => res.data);
}

export function setCustomerActive(
	id: string,
	payload: SetActiveDto,
): Promise<UserMeResponseDto> {
	return http
		.patch<UserMeResponseDto>(`/api/admin/customers/${id}`, payload)
		.then((res) => res.data);
}

/** Full paginated envelope — for infinite-scroll consumers that need `pagination`. */
export function listCooksPage(
	query: AdminSearchQuery = {},
): Promise<PaginatedResponseDto<Cook>> {
	return http
		.get<PaginatedResponseDto<Cook>>("/api/admin/cooks", { params: query })
		.then((res) => res.data);
}

export function listCooks(query: AdminSearchQuery = {}): Promise<Cook[]> {
	return listCooksPage(query).then((res) => res.data);
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
// limit/cursor per the API spec, so text search still filters client-side
// over whatever pages have been loaded.
export function listProductsPage(
	query: AdminCursorQuery = {},
): Promise<PaginatedResponseDto<Product>> {
	return http
		.get<PaginatedResponseDto<Product>>("/api/admin/products", {
			params: query,
		})
		.then((res) => res.data);
}

export function listProducts(): Promise<Product[]> {
	return listProductsPage().then((res) => res.data);
}

export function setProductActive(
	id: string,
	payload: SetActiveDto,
): Promise<Product> {
	return http
		.patch<Product>(`/api/admin/products/${id}`, payload)
		.then((res) => res.data);
}

/** Full paginated envelope — for infinite-scroll consumers that need `pagination`. */
export function listOrdersPage(
	query: AdminOrdersQuery = {},
): Promise<PaginatedResponseDto<OrderResponseDto>> {
	return http
		.get<PaginatedResponseDto<OrderResponseDto>>("/api/admin/orders", {
			params: query,
		})
		.then((res) => res.data);
}

/** Full paginated envelope — for infinite-scroll consumers that need `pagination`. */
export function listCategoriesPage(
	query: AdminSearchQuery = {},
): Promise<PaginatedResponseDto<Category>> {
	return http
		.get<PaginatedResponseDto<Category>>("/api/admin/categories", {
			params: query,
		})
		.then((res) => res.data);
}

export function listCategories(
	query: AdminSearchQuery = {},
): Promise<Category[]> {
	return listCategoriesPage(query).then((res) => res.data);
}
