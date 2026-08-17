export interface PaginationMetaDto {
	nextCursor?: string | null;
	hasMore: boolean;
}

export interface PaginatedResponseDto<T> {
	data: T[];
	pagination: PaginationMetaDto;
}
