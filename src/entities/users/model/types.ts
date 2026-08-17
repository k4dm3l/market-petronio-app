// `enum` isn't allowed here (tsconfig.app.json has erasableSyntaxOnly), so this
// is the erasable-syntax-compatible equivalent: dot access like an enum
// (UserRole.Admin), but compiles away to a plain object + literal union type.
export const UserRole = {
	Customer: "customer",
	Cook: "cook",
	Admin: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface DeliveryGeoPointDto {
	type: "Point";
	/** [longitude (-180..180), latitude (-90..90)] */
	coordinates: [number, number];
}

export interface DeliveryInformationResponseDto {
	location: DeliveryGeoPointDto;
	address: string;
	additionalInformation?: string;
}

export interface UserImageResponseDto {
	url: string;
}

export interface UserAddressResponseDto {
	id: string;
	country: string;
	department: string;
	city: string;
	address: string;
	notes?: string;
	zipcode?: string;
	coordinates: DeliveryGeoPointDto;
	isPrimary: boolean;
}

export interface UserMeResponseDto {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	isActive: boolean;
	image: UserImageResponseDto | null;
	/** Legacy single delivery (spec 005). Prefer `addresses` for new clients. */
	deliveryInformation: DeliveryInformationResponseDto | null;
	/** Saved addresses; at most one is primary (spec 010) */
	addresses: UserAddressResponseDto[];
}

export interface UpsertDeliveryInformationDto {
	location: DeliveryGeoPointDto;
	address: string;
	additionalInformation?: string;
}

export interface CreateAddressDto {
	country: string;
	department: string;
	city: string;
	address: string;
	notes?: string;
	zipcode?: string;
	/** GeoJSON Point [longitude, latitude] */
	coordinates: DeliveryGeoPointDto;
	/** If true (or if this is the first address), demotes any previous primary */
	isPrimary?: boolean;
}

export interface UpdateAddressDto {
	country?: string;
	department?: string;
	city?: string;
	address?: string;
	notes?: string;
	zipcode?: string;
	coordinates?: DeliveryGeoPointDto;
	/** Setting true demotes other primaries atomically. Setting false on the current primary is rejected. */
	isPrimary?: boolean;
}

export interface ImageUploadResponseDto {
	url: string;
}

export interface ImageDeletedResponseDto {
	deleted: boolean;
	/** Present for product image deletes */
	id?: string;
}
