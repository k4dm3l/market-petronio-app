export const PAYMENT_METHOD_OPTIONS = [
	{ id: "pse", name: "PSE", category: "bank_transfer" },
	{ id: "nequi", name: "Nequi", category: "wallet" },
	{ id: "daviplata", name: "DaviPlata", category: "wallet" },
	{ id: "bancolombia", name: "Bancolombia", category: "bank" },
	{ id: "davivienda", name: "Davivienda", category: "bank" },
	{ id: "bbva", name: "BBVA", category: "bank" },
	{ id: "banco_de_bogota", name: "Banco de Bogotá", category: "bank" },
	{ id: "banco_de_occidente", name: "Banco de Occidente", category: "bank" },
	{ id: "scotiabank_colpatria", name: "Scotiabank Colpatria", category: "bank" },
	{ id: "itau", name: "Itaú", category: "bank" },
	{ id: "banco_agrario", name: "Banco Agrario", category: "bank" },
	{ id: "lulo_bank", name: "Lulo Bank", category: "bank" },
	{ id: "movii", name: "MOVii", category: "wallet" },
	{ id: "rappipay", name: "RappiPay", category: "wallet" },
	{ id: "tarjeta", name: "Tarjeta débito/crédito", category: "card" },
	{ id: "bre_b", name: "Bre-B", category: "instant_transfer" },
	{ id: "efectivo", name: "Efectivo", category: "cash" },
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
	lat?: number;
	lng?: number;
	/** Search radius in meters */
	radius?: number;
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
