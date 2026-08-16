import type { ImageDeletedResponseDto } from "@/entities/users";
import { http } from "@/shared/lib/http";
import type {
	CreateProductDto,
	FindNearbyProductsQuery,
	FindProductsQuery,
	Product,
	ProductImageUploadResponseDto,
	UpdateProductDto,
} from "../model/types";

export function findAll(query: FindProductsQuery = {}): Promise<Product[]> {
	return http
		.get<Product[]>("/api/products", { params: query })
		.then((res) => res.data);
}

export function nearby(query: FindNearbyProductsQuery): Promise<Product[]> {
	return http
		.get<Product[]>("/api/products/nearby", { params: query })
		.then((res) => res.data);
}

export function findOne(id: string): Promise<Product> {
	return http.get<Product>(`/api/products/${id}`).then((res) => res.data);
}

export function create(payload: CreateProductDto): Promise<Product> {
	return http.post<Product>("/api/products", payload).then((res) => res.data);
}

export function update(
	id: string,
	payload: UpdateProductDto,
): Promise<Product> {
	return http
		.patch<Product>(`/api/products/${id}`, payload)
		.then((res) => res.data);
}

export function remove(id: string): Promise<Product> {
	return http.delete<Product>(`/api/products/${id}`).then((res) => res.data);
}

// JPEG/PNG/WEBP, max 5 MB. Owner cook or admin only. Max 5 images per product.
export function uploadImage(
	id: string,
	file: File,
): Promise<ProductImageUploadResponseDto> {
	const formData = new FormData();
	formData.append("file", file);
	return http
		.post<ProductImageUploadResponseDto>(`/api/products/${id}/images`, formData)
		.then((res) => res.data);
}

export function removeImage(
	id: string,
	imageId: string,
): Promise<ImageDeletedResponseDto> {
	return http
		.delete<ImageDeletedResponseDto>(`/api/products/${id}/images/${imageId}`)
		.then((res) => res.data);
}
