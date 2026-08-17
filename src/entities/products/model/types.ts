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
	/**
	 * Ids from POST /products/images (temporary images owned by the caller).
	 * Embedded on the product as `{ id, url, publicId }` subdocs. There is no
	 * equivalent field on UpdateProductDto — images can only be attached at
	 * creation time; afterwards only DELETE /products/images/:imageId works.
	 */
	images?: string[];
	/** Must already exist in the global tag catalog (POST /tags). Normalized to lowercase; max 10; unique */
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
	/** Page size (1–100) */
	limit?: number;
	/** Opaque cursor from the previous page `pagination.nextCursor` */
	cursor?: string;
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
	/** Page size (1–100) */
	limit?: number;
	/** Opaque cursor from the previous page `pagination.nextCursor` */
	cursor?: string;
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

export interface ProductImageItemDto {
	/** Persisted image id — send in CreateProductDto.images */
	id: string;
	url: string;
	/** Provider public id (Cloudinary) */
	publicId: string;
}

export interface ProductImagesUploadResponseDto {
	images: ProductImageItemDto[];
}

/**
 * The API doesn't document a response schema for product reads; inferred from
 * CreateProductDto/UpdateProductDto. Verify field names against a real response.
 */
export interface Product {
	id: string;
	name: string;
	description?: string;
	images: ProductImageItemDto[];
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
