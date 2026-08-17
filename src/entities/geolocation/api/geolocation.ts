import axios from "axios";
import type { LocationSuggestion } from "../model/types";

interface LocationIqSearchResult {
	place_id: string;
	display_name: string;
	lat: string;
	lon: string;
}

const locationIq = axios.create({
	baseURL: "https://us1.locationiq.com/v1",
});

export async function searchLocations(
	query: string,
): Promise<LocationSuggestion[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];

	try {
		const { data } = await locationIq.get<LocationIqSearchResult[]>("/search", {
			params: {
				key: import.meta.env.VITE_GEOLOCATION_API_KEY,
				q: trimmed,
				format: "json",
				// Restricts results to Colombia only.
				countrycodes: "co",
				limit: 5,
			},
		});

		return data.map((result) => ({
			id: result.place_id,
			name: result.display_name,
			latitude: Number(result.lat),
			longitude: Number(result.lon),
		}));
	} catch {
		// LocationIQ returns a 404 when no matches are found.
		return [];
	}
}
