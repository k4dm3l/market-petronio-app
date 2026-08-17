export const mutationKeys = {
	auth: {
		login: () => ["auth", "login"] as const,
		register: () => ["auth", "register"] as const,
		recoveryRequest: () => ["auth", "recovery-request"] as const,
		recoveryReset: () => ["auth", "recovery-reset"] as const,
	},
	users: {
		upsertDeliveryInformation: () =>
			["users", "upsert-delivery-information"] as const,
		uploadProfileImages: () => ["users", "upload-profile-images"] as const,
		deleteProfileImage: () => ["users", "delete-profile-image"] as const,
		addAddress: () => ["users", "add-address"] as const,
		updateAddress: (addressId: string) =>
			["users", "update-address", addressId] as const,
		deleteAddress: (addressId: string) =>
			["users", "delete-address", addressId] as const,
	},
	cooks: {
		create: () => ["cooks", "create"] as const,
		update: (id: string) => ["cooks", "update", id] as const,
	},
	products: {
		create: () => ["products", "create"] as const,
		update: (id: string) => ["products", "update", id] as const,
		remove: (id: string) => ["products", "remove", id] as const,
		uploadImage: () => ["products", "upload-image"] as const,
		removeImage: () => ["products", "remove-image"] as const,
	},
	categories: {
		create: () => ["categories", "create"] as const,
		update: (id: string) => ["categories", "update", id] as const,
	},
	tags: {
		create: () => ["tags", "create"] as const,
	},
	orders: {
		create: () => ["orders", "create"] as const,
		updateStatus: (id: string) => ["orders", "update-status", id] as const,
		updatePayment: (id: string) => ["orders", "update-payment", id] as const,
		updateShipping: (id: string) => ["orders", "update-shipping", id] as const,
		confirmReception: (id: string) =>
			["orders", "confirm-reception", id] as const,
	},
	admin: {
		setCustomerActive: (id: string) =>
			["admin", "set-customer-active", id] as const,
		setCookActive: (id: string) => ["admin", "set-cook-active", id] as const,
		setProductActive: (id: string) =>
			["admin", "set-product-active", id] as const,
		promoteAdmin: (id: string) => ["admin", "promote-admin", id] as const,
	},
} as const;
