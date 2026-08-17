import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { getPlace } from "../api/locations";

/** Fetches normalized address details once the user picks a prediction. */
export function useGetPlace(placeId: string | null) {
	return useQuery({
		queryKey: queryKeys.locations.place(placeId ?? ""),
		queryFn: () => getPlace(placeId ?? ""),
		enabled: Boolean(placeId),
	});
}
