import type { DeliveryGeoPointDto } from "@/entities/users";

// `enum` isn't allowed here (tsconfig.app.json has erasableSyntaxOnly), so
// these are the erasable-syntax-compatible equivalent: dot access like an
// enum (OrderStatus.Pending), but compiles away to a plain object + literal
// union type. Mirrors the UserRole pattern in entities/users.
export const OrderStatus = {
	Pending: "PENDING",
	Confirmed: "CONFIRMED",
	Preparing: "PREPARING",
	ReadyToShip: "READY_TO_SHIP",
	Shipped: "SHIPPED",
	Delivered: "DELIVERED",
	Cancelled: "CANCELLED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

// The forward lifecycle a cook advances an order through, one step at a
// time — Cancelled is a separate terminal state reachable from any of these,
// not a step in this sequence.
export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
	OrderStatus.Pending,
	OrderStatus.Confirmed,
	OrderStatus.Preparing,
	OrderStatus.ReadyToShip,
	OrderStatus.Shipped,
	OrderStatus.Delivered,
];

// Null when `status` is already the last step (Delivered) or isn't part of
// the forward sequence (Cancelled).
export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
	const index = ORDER_STATUS_SEQUENCE.indexOf(status);
	if (index === -1 || index === ORDER_STATUS_SEQUENCE.length - 1) return null;
	return ORDER_STATUS_SEQUENCE[index + 1];
}

export const OrderPaymentStatus = {
	Pending: "PENDING",
	PaymentInstructions: "PAYMENT_INSTRUCTIONS",
	Paid: "PAID",
	Failed: "FAILED",
	Cancelled: "CANCELLED",
} as const;

export type OrderPaymentStatus =
	(typeof OrderPaymentStatus)[keyof typeof OrderPaymentStatus];

export const OrderShippingStatus = {
	Pending: "PENDING",
	Preparing: "PREPARING",
	ReadyToShip: "READY_TO_SHIP",
	Shipped: "SHIPPED",
	InTransit: "IN_TRANSIT",
	Delivered: "DELIVERED",
} as const;

export type OrderShippingStatus =
	(typeof OrderShippingStatus)[keyof typeof OrderShippingStatus];

export interface CreateOrderItemDto {
	productId: string;
	quantity: number;
}

export interface CreateOrderDeliveryDto {
	/**
	 * CUSTOMER_PROFILE copies saved user delivery; CUSTOM requires location + address
	 */
	source: "CUSTOMER_PROFILE" | "CUSTOM";
	/** Required when source is CUSTOM. GeoJSON Point [longitude, latitude] */
	location?: DeliveryGeoPointDto;
	/** Required when source is CUSTOM (human-readable address) */
	address?: string;
	/** Optional notes; for CUSTOM only (profile path uses saved notes) */
	additionalInformation?: string;
}

export interface CreateOrderDto {
	/** Single-cook order (MVP) */
	cookId: string;
	items: CreateOrderItemDto[];
	delivery: CreateOrderDeliveryDto;
	shippingCost?: number;
	paymentMethod?: string;
}

export interface OrderItemResponseDto {
	productId: string;
	name: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface OrderTotalsResponseDto {
	subtotal: number;
	shipping: number;
	total: number;
}

export interface OrderDeliveryResponseDto {
	/** Snapshot of delivery coordinates at order creation */
	location: DeliveryGeoPointDto;
	address: string;
	additionalInformation?: string | null;
}

export interface OrderPaymentResponseDto {
	status: OrderPaymentStatus;
	method?: string;
	customerReportedPaid: boolean;
	paidAt?: string;
}

export interface OrderShippingResponseDto {
	status: OrderShippingStatus;
	carrier?: string;
	trackingNumber?: string;
	shippedAt?: string;
	deliveredAt?: string;
}

export interface CustomerConfirmationResponseDto {
	confirmed: boolean;
	confirmedAt?: string;
}

export interface OrderResponseDto {
	id: string;
	orderNumber: string;
	customerId: string;
	cookId: string;
	items: OrderItemResponseDto[];
	totals: OrderTotalsResponseDto;
	/** Delivery address/location copied at create time; not linked to profile updates */
	delivery: OrderDeliveryResponseDto;
	payment: OrderPaymentResponseDto;
	shipping: OrderShippingResponseDto;
	status: OrderStatus;
	customerConfirmation: CustomerConfirmationResponseDto;
	createdAt: string;
	updatedAt: string;
}

export interface CustomerOrderHistoryItemDto {
	id: string;
	status: OrderStatus;
	paymentStatus: OrderPaymentStatus;
	total: number;
	createdAt: string;
}

export interface OrdersPaginationDto {
	nextCursor?: string | null;
	hasMore: boolean;
}

export interface CustomerOrdersListResponseDto {
	data: CustomerOrderHistoryItemDto[];
	pagination: OrdersPaginationDto;
}

export interface UpdateOrderStatusDto {
	status: OrderStatus;
}

export interface UpdatePaymentDto {
	status?: OrderPaymentStatus;
	method?: string;
	/** Customer reports external payment was made */
	customerReportedPaid?: boolean;
}

export interface UpdateShippingDto {
	status: OrderShippingStatus;
	carrier?: string;
	trackingNumber?: string;
}

export interface FindOrdersQuery {
	/** Page size (1–100) */
	limit?: number;
	/** Opaque cursor from the previous page (do not pass customerId) */
	cursor?: string;
	status?: OrderStatus;
	search?: string;
}
