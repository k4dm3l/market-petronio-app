export interface TagResponseDto {
	id: string;
	text: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTagDto {
	text: string;
}

export interface FindTagsQuery {
	/** Page size (1–100) */
	limit?: number;
	/** Opaque cursor from the previous page `pagination.nextCursor` */
	cursor?: string;
	search?: string;
}
