export const queryKeys = {
	users: {
		me: () => ["users", "me"] as const,
		// Called with no args, this is a prefix — `invalidateQueries` matches it
		// against every cached search-term variant below it (exact: false).
		customers: (params?: Record<string, unknown>) =>
			params
				? (["users", "customers", params] as const)
				: (["users", "customers"] as const),
		// Nested under the same "customers" prefix so invalidating
		// `customers()` (no args) also invalidates this infinite-scroll cache.
		customersInfinite: (params?: Record<string, unknown>) =>
			params
				? (["users", "customers", "infinite", params] as const)
				: (["users", "customers", "infinite"] as const),
	},
	cooks: {
		all: () => ["cooks"] as const,
		list: (params?: Record<string, unknown>) =>
			["cooks", "list", params] as const,
		listAdmin: (params?: Record<string, unknown>) =>
			params
				? (["cooks", "list-admin", params] as const)
				: (["cooks", "list-admin"] as const),
		// Nested under the same "list-admin" prefix so invalidating
		// `listAdmin()` (no args) also invalidates this infinite-scroll cache.
		listAdminInfinite: (params?: Record<string, unknown>) =>
			params
				? (["cooks", "list-admin", "infinite", params] as const)
				: (["cooks", "list-admin", "infinite"] as const),
		detail: (id: string) => ["cooks", "detail", id] as const,
		dashboard: () => ["cooks", "dashboard"] as const,
	},
	products: {
		all: () => ["products"] as const,
		list: (params?: Record<string, unknown>) =>
			["products", "list", params] as const,
		listAdmin: () => ["products", "list-admin"] as const,
		// Nested under the same "list-admin" prefix so invalidating
		// `listAdmin()` also invalidates this infinite-scroll cache. No
		// `search` param here — /api/admin/products doesn't support it.
		listAdminInfinite: () => ["products", "list-admin", "infinite"] as const,
		nearby: (params: Record<string, unknown>) =>
			["products", "nearby", params] as const,
		detail: (id: string) => ["products", "detail", id] as const,
	},
	categories: {
		all: () => ["categories"] as const,
		list: (params?: Record<string, unknown>) =>
			params
				? (["categories", "list", params] as const)
				: (["categories", "list"] as const),
		listAdmin: (params?: Record<string, unknown>) =>
			params
				? (["categories", "list-admin", params] as const)
				: (["categories", "list-admin"] as const),
		// Nested under the same "list-admin" prefix so invalidating
		// `listAdmin()` (no args) also invalidates this infinite-scroll cache.
		listAdminInfinite: (params?: Record<string, unknown>) =>
			params
				? (["categories", "list-admin", "infinite", params] as const)
				: (["categories", "list-admin", "infinite"] as const),
		detail: (id: string) => ["categories", "detail", id] as const,
	},
	orders: {
		all: () => ["orders"] as const,
		list: (params?: Record<string, unknown>) =>
			["orders", "list", params] as const,
		listAdmin: (params?: Record<string, unknown>) =>
			params
				? (["orders", "list-admin", params] as const)
				: (["orders", "list-admin"] as const),
		detail: (id: string) => ["orders", "detail", id] as const,
	},
	stats: {
		dashboard: () => ["stats", "dashboard"] as const,
	},
	notifications: {
		all: () => ["notifications"] as const,
	},
	tags: {
		// A bare top-level prefix — `invalidateQueries` against this matches
		// every cached variant below it (list and listInfinite alike).
		all: () => ["tags"] as const,
		list: (params?: Record<string, unknown>) =>
			["tags", "list", params] as const,
		listInfinite: (params?: Record<string, unknown>) =>
			["tags", "list-infinite", params] as const,
	},
	geolocation: {
		search: (query: string) => ["geolocation", "search", query] as const,
	},
	locations: {
		search: (params: Record<string, unknown>) =>
			["locations", "search", params] as const,
		place: (placeId: string) => ["locations", "place", placeId] as const,
	},
} as const;
