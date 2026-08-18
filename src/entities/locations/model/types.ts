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
 * Verified against a real response on 2026-08-17: `{ data: [...] }`, each
 * item just `{ placeId, description }`.
 */
export interface LocationPredictionDto {
	placeId: string;
	description: string;
}

export interface LocationSearchResponseDto {
	data: LocationPredictionDto[];
}

export interface LocationCoordinatesDto {
	latitude: number;
	longitude: number;
}

/**
 * Verified against a real response on 2026-08-17. Note `coordinates` here is
 * a plain `{ latitude, longitude }` pair — NOT a GeoJSON Point like the rest
 * of the app's location fields (e.g. entities/users' DeliveryGeoPointDto).
 */
export interface AddressDetailsResponseDto {
	placeId: string;
	/** The full, canonical address string — prefer this over `address` for display/storage. */
	formattedAddress: string;
	/** A partial fragment (e.g. just the street), not the full address. */
	address?: string;
	city?: string;
	department?: string;
	country?: string;
	zipcode?: string;
	coordinates: LocationCoordinatesDto;
}
