import { http } from "@/shared/lib/http";
import type {
	CreateOrderDto,
	CustomerOrderHistoryItemDto,
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

// Customers get { data: CustomerOrderHistoryItemDto[] } as documented — but
// verified against a real cook-role response on 2026-08-22: cooks actually
// get full OrderResponseDto[] in `data` (paymentStatus/total flat fields are
// absent, values live under nested payment.status/totals.total instead).
// Normalized here so every caller can rely on the documented summary shape.
function normalizeOrderHistoryItem(
	item: CustomerOrderHistoryItemDto | OrderResponseDto,
): CustomerOrderHistoryItemDto {
	return {
		id: item.id,
		status: item.status,
		paymentStatus:
			"paymentStatus" in item ? item.paymentStatus : item.payment.status,
		total: "total" in item ? item.total : item.totals.total,
		createdAt: item.createdAt,
	};
}

export function findAll(
	query: FindOrdersQuery = {},
): Promise<CustomerOrdersListResponseDto> {
	return http
		.get<CustomerOrdersListResponseDto>("/api/orders", { params: query })
		.then((res) => ({
			...res.data,
			data: res.data.data.map(normalizeOrderHistoryItem),
		}));
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
