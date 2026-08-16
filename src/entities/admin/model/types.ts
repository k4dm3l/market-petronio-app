export interface SetActiveDto {
	isActive: boolean;
}

export interface PaginationDto {
	nextCursor: string | null;
	hasMore: boolean;
}

export interface PaginatedResponseDto<T> {
	data: T[];
	pagination: PaginationDto;
}
