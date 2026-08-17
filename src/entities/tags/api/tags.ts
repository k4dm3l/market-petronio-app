import type { PaginatedResponseDto } from "@/shared/lib/pagination";
import { http } from "@/shared/lib/http";
import type { CreateTagDto, FindTagsQuery, TagResponseDto } from "../model/types";

/** Full paginated envelope — for infinite-scroll consumers that need `pagination`. */
export function findAllPage(
	query: FindTagsQuery = {},
): Promise<PaginatedResponseDto<TagResponseDto>> {
	return http
		.get<PaginatedResponseDto<TagResponseDto>>("/api/tags", { params: query })
		.then((res) => res.data);
}

export function findAll(query: FindTagsQuery = {}): Promise<TagResponseDto[]> {
	return findAllPage(query).then((res) => res.data);
}

/** Idempotent — safe to call even if the tag already exists. */
export function create(payload: CreateTagDto): Promise<TagResponseDto> {
	return http.post<TagResponseDto>("/api/tags", payload).then((res) => res.data);
}
