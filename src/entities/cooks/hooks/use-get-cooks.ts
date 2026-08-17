import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config";
import { findAll } from "../api/cooks";
import type { FindCooksQuery } from "../model/types";

/** Public catalog (GET /api/cooks) — active cooks only. */
export function useGetCooks(query: FindCooksQuery = {}) {
	return useQuery({
		queryKey: queryKeys.cooks.list({ ...query }),
		queryFn: () => findAll(query),
	});
}
