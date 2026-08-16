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

export interface UserMeResponseDto {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	isActive: boolean;
	image: UserImageResponseDto | null;
	deliveryInformation: DeliveryInformationResponseDto | null;
}

export interface UpsertDeliveryInformationDto {
	location: DeliveryGeoPointDto;
	address: string;
	additionalInformation?: string;
}

export interface ImageUploadResponseDto {
	url: string;
}

export interface ImageDeletedResponseDto {
	deleted: boolean;
	/** Present for product image deletes */
	id?: string;
}
