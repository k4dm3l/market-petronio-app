import { http } from "@/shared/lib/http";
import type {
	CreateOrderDto,
	CustomerOrdersListResponseDto,
	FindOrdersQuery,
	OrderResponseDto,
	UpdateOrderStatusDto,
	UpdatePaymentDto,
	UpdateShippingDto,
} from "../model/types";

export function create(payload: CreateOrderDto): Promise<OrderResponseDto> {
	return http
		.post<OrderResponseDto>("/api/orders", payload)
		.then((res) => res.data);
}

// Customers get { data: CustomerOrderHistoryItemDto[] }; per the API description,
// cooks/admins get the same pagination shape but with full OrderResponseDto[] in `data`.
export function findAll(
	query: FindOrdersQuery = {},
): Promise<CustomerOrdersListResponseDto> {
	return http
		.get<CustomerOrdersListResponseDto>("/api/orders", { params: query })
		.then((res) => res.data);
}

export function findOne(id: string): Promise<OrderResponseDto> {
	return http
		.get<OrderResponseDto>(`/api/orders/${id}`)
		.then((res) => res.data);
}

export function updateStatus(
	id: string,
	payload: UpdateOrderStatusDto,
): Promise<OrderResponseDto> {
	return http
		.patch<OrderResponseDto>(`/api/orders/${id}/status`, payload)
		.then((res) => res.data);
}

export function updatePayment(
	id: string,
	payload: UpdatePaymentDto,
): Promise<OrderResponseDto> {
	return http
		.patch<OrderResponseDto>(`/api/orders/${id}/payment`, payload)
		.then((res) => res.data);
}

export function updateShipping(
	id: string,
	payload: UpdateShippingDto,
): Promise<OrderResponseDto> {
	return http
		.patch<OrderResponseDto>(`/api/orders/${id}/shipping`, payload)
		.then((res) => res.data);
}

export function confirmReception(id: string): Promise<OrderResponseDto> {
	return http
		.post<OrderResponseDto>(`/api/orders/${id}/confirm-reception`)
		.then((res) => res.data);
}
