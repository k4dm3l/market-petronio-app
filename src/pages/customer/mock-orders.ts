import type { CustomerOrderHistoryItemDto } from "@/entities/orders";
import { MOCK_ORDER_DETAILS } from "./mock-order-details";

// GET /api/orders returns this summary shape in `data` — shaped exactly like
// CustomerOrderHistoryItemDto. Derived from mock-order-details.ts so ids line
// up when a card's "Ver detalle" navigates to the detail page.
export const MOCK_ORDERS: CustomerOrderHistoryItemDto[] =
	MOCK_ORDER_DETAILS.map((order) => ({
		id: order.id,
		status: order.status,
		paymentStatus: order.payment.status,
		total: order.totals.total,
		createdAt: order.createdAt,
	}));
