import type { DeliveryGeoPointDto } from "@/entities/users";

export interface SearchLocationsQuery {
	/** Address search text (frontend should debounce 300–500ms) */
	query: string;
	/** Optional. Bias results near this point (use with longitude). */
	latitude?: number;
	/** Optional. Bias results near this point (use with latitude). */
	longitude?: number;
	/** Bias radius in meters. Ignored unless both latitude and longitude are sent. */
	radius?: number;
}

/**
 * The OpenAPI spec only names LocationSearchResponseDto via $ref, without a
 * schema body; inferred from the summary ("Autocomplete address search" via
 * Google Places Autocomplete). Verify field names against a real response.
 */
export interface LocationPredictionDto {
	placeId: string;
	description: string;
	mainText?: string;
	secondaryText?: string;
}

export interface LocationSearchResponseDto {
	predictions: LocationPredictionDto[];
}

/**
 * The OpenAPI spec only names AddressDetailsResponseDto via $ref, without a
 * schema body. Its description says it "Maps to UserAddress fields", so this
 * mirrors CreateAddressDto/UserAddressResponseDto's location fields — minus
 * id/notes/isPrimary, which don't apply to a raw place lookup. Verify against
 * a real response.
 */
export interface AddressDetailsResponseDto {
	address: string;
	city?: string;
	department?: string;
	country?: string;
	zipcode?: string;
	/** GeoJSON Point [longitude, latitude] */
	coordinates: DeliveryGeoPointDto;
}
