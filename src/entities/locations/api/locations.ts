import { http } from "@/shared/lib/http";
import type {
	AddressDetailsResponseDto,
	LocationSearchResponseDto,
	SearchLocationsQuery,
} from "../model/types";

/** Redis-cached server-side proxy for Google Places Autocomplete. */
export function search(
	query: SearchLocationsQuery,
): Promise<LocationSearchResponseDto> {
	return http
		.get<LocationSearchResponseDto>("/api/locations/search", {
			params: query,
		})
		.then((res) => res.data);
}

/** Redis-cached server-side proxy for Google Place Details (New). */
export function getPlace(placeId: string): Promise<AddressDetailsResponseDto> {
	return http
		.get<AddressDetailsResponseDto>(`/api/locations/places/${placeId}`)
		.then((res) => res.data);
}
