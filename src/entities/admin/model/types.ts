import type { OrderStatus } from "@/entities/orders";

export interface SetActiveDto {
	isActive: boolean;
}

export interface PaginationDto {
	nextCursor: string | null;
	hasMore: boolean;
}

export interface PaginatedResponseDto<T> {
	data: T[];
	pagination: PaginationDto;
}

/** GET /api/admin/{customers,cooks,categories} all support this. */
export interface AdminSearchQuery {
	search?: string;
	/** Page size (1–100) */
	limit?: number;
	/** Opaque cursor from the previous page `pagination.nextCursor` */
	cursor?: string;
}

/** GET /api/admin/orders additionally supports a status filter. */
export interface AdminOrdersQuery extends AdminSearchQuery {
	status?: OrderStatus;
}

/** GET /api/admin/products only takes these — no `search` support server-side. */
export interface AdminCursorQuery {
	/** Page size (1–100) */
	limit?: number;
	/** Opaque cursor from the previous page `pagination.nextCursor` */
	cursor?: string;
}
