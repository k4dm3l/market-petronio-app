import type { Product } from "@/entities/products";

export interface ProductFilters {
	search: string;
	categoryIds: string[];
	tags: string[];
	minPrice: string;
	maxPrice: string;
}

export const EMPTY_FILTERS: ProductFilters = {
	search: "",
	categoryIds: [],
	tags: [],
	minPrice: "",
	maxPrice: "",
};

export function hasActiveFilters(filters: ProductFilters): boolean {
	return (
		filters.search.trim().length > 0 ||
		filters.categoryIds.length > 0 ||
		filters.tags.length > 0 ||
		filters.minPrice.trim().length > 0 ||
		filters.maxPrice.trim().length > 0
	);
}

export function countActiveFilters(filters: ProductFilters): number {
	return (
		filters.categoryIds.length +
		filters.tags.length +
		(filters.minPrice.trim() ? 1 : 0) +
		(filters.maxPrice.trim() ? 1 : 0)
	);
}

export function filterProducts(
	products: Product[],
	filters: ProductFilters,
): Product[] {
	const search = filters.search.trim().toLowerCase();
	const min = filters.minPrice ? Number(filters.minPrice) : undefined;
	const max = filters.maxPrice ? Number(filters.maxPrice) : undefined;

	return products.filter((product) => {
		if (search && !product.name.toLowerCase().includes(search)) return false;

		if (
			filters.categoryIds.length > 0 &&
			(!product.categoryId || !filters.categoryIds.includes(product.categoryId))
		) {
			return false;
		}

		if (
			filters.tags.length > 0 &&
			!filters.tags.every((tag) => product.tags.includes(tag))
		) {
			return false;
		}

		if (min !== undefined && product.price < min) return false;
		if (max !== undefined && product.price > max) return false;

		return true;
	});
}
