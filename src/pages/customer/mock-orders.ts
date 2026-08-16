import type { CustomerOrderHistoryItemDto } from "@/entities/orders";

// No backend yet — shaped exactly like CustomerOrderHistoryItemDto so wiring
// the real GET /orders call in later is a drop-in replacement.
export const MOCK_ORDERS: CustomerOrderHistoryItemDto[] = [
	{
		id: "order-1",
		status: "DELIVERED",
		paymentStatus: "PAID",
		total: 82000,
		createdAt: "2026-08-10T15:30:00.000Z",
	},
	{
		id: "order-2",
		status: "SHIPPED",
		paymentStatus: "PAID",
		total: 47000,
		createdAt: "2026-08-12T12:00:00.000Z",
	},
	{
		id: "order-3",
		status: "PREPARING",
		paymentStatus: "PAYMENT_INSTRUCTIONS",
		total: 35000,
		createdAt: "2026-08-14T09:15:00.000Z",
	},
	{
		id: "order-4",
		status: "CANCELLED",
		paymentStatus: "CANCELLED",
		total: 22000,
		createdAt: "2026-08-05T18:45:00.000Z",
	},
];
