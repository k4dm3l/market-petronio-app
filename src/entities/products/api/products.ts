import type { ImageDeletedResponseDto } from "@/entities/users";
import type { PaginatedResponseDto } from "@/shared/lib/pagination";
import { http } from "@/shared/lib/http";
import type {
	CreateProductDto,
	FindNearbyProductsQuery,
	FindProductsQuery,
	Product,
	ProductImagesUploadResponseDto,
	UpdateProductDto,
} from "../model/types";

export function findAll(query: FindProductsQuery = {}): Promise<Product[]> {
	return http
		.get<PaginatedResponseDto<Product>>("/api/products", { params: query })
		.then((res) => res.data.data);
}

export function nearby(query: FindNearbyProductsQuery): Promise<Product[]> {
	return http
		.get<PaginatedResponseDto<Product>>("/api/products/nearby", {
			params: query,
		})
		.then((res) => res.data.data);
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

// JPEG/PNG/WEBP, max 5 MB. Not tied to a product — returns temporary image(s)
// owned by the caller; pass the returned id(s) as CreateProductDto.images.
export function uploadImage(
	file: File,
): Promise<ProductImagesUploadResponseDto> {
	const formData = new FormData();
	formData.append("file", file);
	return http
		.post<ProductImagesUploadResponseDto>("/api/products/images", formData)
		.then((res) => res.data);
}

export function removeImage(imageId: string): Promise<ImageDeletedResponseDto> {
	return http
		.delete<ImageDeletedResponseDto>(`/api/products/images/${imageId}`)
		.then((res) => res.data);
}
