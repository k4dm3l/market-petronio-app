export interface CookFilters {
	search: string;
	specialties: string[];
}

export const EMPTY_COOK_FILTERS: CookFilters = {
	search: "",
	specialties: [],
};

// Search matches server-side against the current filters, so it's excluded
// from the count — mirrors ProductFilters' countActiveFilters.
export function hasActiveCookFilters(filters: CookFilters): boolean {
	return filters.search.trim().length > 0 || filters.specialties.length > 0;
}

export function countActiveCookFilters(filters: CookFilters): number {
	return filters.specialties.length;
}
