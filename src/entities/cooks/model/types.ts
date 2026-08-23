// Must mirror PaymentMethodDto.type exactly — the API rejects anything else.
export const PAYMENT_METHOD_OPTIONS = [
	{ id: "nequi", name: "Nequi", category: "wallet" },
	{ id: "daviplata", name: "DaviPlata", category: "wallet" },
	{
		id: "bank_transfer",
		name: "PSE / Transferencia bancaria",
		category: "bank_transfer",
	},
] as const;

export type PaymentMethodType = (typeof PAYMENT_METHOD_OPTIONS)[number]["id"];
export type PaymentMethodCategory =
	(typeof PAYMENT_METHOD_OPTIONS)[number]["category"];

export interface PaymentMethodDto {
	type: PaymentMethodType;
	details: string;
	isEnabled?: boolean;
}

export interface CreateCookDto {
	/** Existing user id that will own this cook profile */
	userId: string;
	displayName: string;
	bio?: string;
	specialties?: string[];
	publicLocation: string;
	/** Longitude (GeoJSON order) */
	longitude: number;
	/** Latitude (GeoJSON order) */
	latitude: number;
	paymentMethods?: PaymentMethodDto[];
	contactWhatsApp?: string;
}

export interface UpdateCookDto {
	displayName?: string;
	bio?: string;
	specialties?: string[];
	publicLocation?: string;
	longitude?: number;
	latitude?: number;
	paymentMethods?: PaymentMethodDto[];
	contactWhatsApp?: string;
	/** Admin only */
	isActive?: boolean;
}

export interface FindCooksQuery {
	/** Page size (1–100) */
	limit?: number;
	/** Opaque cursor from the previous page `pagination.nextCursor` */
	cursor?: string;
	lat?: number;
	lng?: number;
	/** Search radius in meters */
	radius?: number;
	/** Case-insensitive name search */
	search?: string;
	/** Comma-separated specialties, filtered server-side */
	specialties?: string;
}

export interface CookLocationDto {
	type: "Point";
	/** [longitude, latitude] (GeoJSON order) */
	coordinates: [number, number];
}

export interface Cook {
	id: string;
	userId: string;
	displayName: string;
	bio?: string;
	specialties: string[];
	publicLocation: string;
	location: CookLocationDto;
	paymentMethods: PaymentMethodDto[];
	contactWhatsApp?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CookDashboardProductDto {
	id: string;
	name: string;
	stock: number;
	isAvailable: boolean;
	availability: "available" | "made_to_order";
}

/**
 * The API doesn't document a response schema for GET /api/cooks/me/dashboard;
 * verified against a real response on 2026-08-17.
 */
export interface CookDashboardResponseDto {
	cookId: string;
	pendingOrders: number;
	ordersBeingPrepared: number;
	shippedOrders: number;
	monthlySales: number;
	products: CookDashboardProductDto[];
}
