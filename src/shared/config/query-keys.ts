export const queryKeys = {
	users: {
		me: () => ["users", "me"] as const,
		customers: () => ["users", "customers"] as const,
	},
	cooks: {
		all: () => ["cooks"] as const,
		list: (params?: Record<string, unknown>) =>
			["cooks", "list", params] as const,
		listAdmin: () => ["cooks", "list-admin"] as const,
		detail: (id: string) => ["cooks", "detail", id] as const,
		dashboard: () => ["cooks", "dashboard"] as const,
	},
	products: {
		all: () => ["products"] as const,
		list: (params?: Record<string, unknown>) =>
			["products", "list", params] as const,
		listAdmin: () => ["products", "list-admin"] as const,
		nearby: (params: Record<string, unknown>) =>
			["products", "nearby", params] as const,
		detail: (id: string) => ["products", "detail", id] as const,
	},
	categories: {
		all: () => ["categories"] as const,
		list: () => ["categories", "list"] as const,
		listAdmin: () => ["categories", "list-admin"] as const,
		detail: (id: string) => ["categories", "detail", id] as const,
	},
	orders: {
		all: () => ["orders"] as const,
		list: (params?: Record<string, unknown>) =>
			["orders", "list", params] as const,
		listAdmin: () => ["orders", "list-admin"] as const,
		detail: (id: string) => ["orders", "detail", id] as const,
	},
	stats: {
		dashboard: () => ["stats", "dashboard"] as const,
	},
	notifications: {
		all: () => ["notifications"] as const,
	},
	geolocation: {
		search: (query: string) => ["geolocation", "search", query] as const,
	},
} as const;
