export interface CreateCategoryDto {
	name: string;
	description?: string;
	image?: string;
}

export interface UpdateCategoryDto {
	name?: string;
	description?: string;
	image?: string;
	/** Admin activate/deactivate */
	isActive?: boolean;
}

/**
 * The API doesn't document a response schema for category reads; inferred from
 * CreateCategoryDto/UpdateCategoryDto. Verify field names against a real response.
 */
export interface Category {
	id: string;
	name: string;
	description?: string;
	image?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}
