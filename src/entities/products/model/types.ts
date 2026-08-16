export type ProductAvailability = "available" | "made_to_order";

export interface CreateProductDto {
	name: string;
	description?: string;
	price: number;
	/** Stock units (used when availability=available) */
	stock?: number;
	categoryId?: string;
	/** Required for admin; ignored for cooks (uses their profile) */
	cookId?: string;
	availability: ProductAvailability;
	/** Preparation time in hours (e.g. 48 = 2 days) */
	preparationTimeHours?: number;
	/** Required minimum when made_to_order */
	minimumOrderQuantity?: number;
	/** Normalized to lowercase/hyphenated; max 10; unique */
	tags?: string[];
	isAvailable?: boolean;
}

export interface UpdateProductDto {
	name?: string;
	description?: string;
	price?: number;
	stock?: number;
	categoryId?: string;
	availability?: ProductAvailability;
	preparationTimeHours?: number;
	minimumOrderQuantity?: number;
	tags?: string[];
	isAvailable?: boolean;
	/** Admin soft-deactivate */
	isActive?: boolean;
}

export interface FindProductsQuery {
	/** Case-insensitive name search */
	search?: string;
	categoryId?: string;
	cookId?: string;
	minPrice?: number;
	maxPrice?: number;
	/** Defaults to true (only available products in catalog) */
	isAvailable?: boolean;
	availability?: ProductAvailability;
	/** Comma-separated tags; AND semantics. Normalized lowercase. */
	tags?: string;
	/** With lng+radius: proximity filter */
	lat?: number;
	lng?: number;
	/** Radius in meters */
	radius?: number;
}

export interface FindNearbyProductsQuery {
	latitude: number;
	longitude: number;
	/** Radius in meters */
	radius?: number;
	categoryId?: string;
	/** Comma-separated tags; AND semantics */
	tags?: string;
	minPrice?: number;
	maxPrice?: number;
}

export interface ProductImageDto {
	id: string;
	url: string;
}

/**
 * The API doesn't document a response schema for product reads; inferred from
 * CreateProductDto/UpdateProductDto. Verify field names against a real response.
 */
export interface Product {
	id: string;
	name: string;
	description?: string;
	images: ProductImageDto[];
	price: number;
	stock?: number;
	categoryId?: string;
	cookId: string;
	availability: ProductAvailability;
	preparationTimeHours?: number;
	minimumOrderQuantity?: number;
	tags: string[];
	isAvailable: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProductImageUploadResponseDto {
	url: string;
	/** Subdocument id — use with DELETE /products/:id/images/:imageId */
	id: string;
}
