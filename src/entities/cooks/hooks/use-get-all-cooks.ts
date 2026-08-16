import { useQuery } from "@tanstack/react-query";
import { listCooks } from "@/entities/admin";
import { queryKeys } from "@/shared/config";

export function useGetAllCooks() {
	return useQuery({
		queryKey: queryKeys.cooks.listAdmin(),
		queryFn: listCooks,
	});
}
