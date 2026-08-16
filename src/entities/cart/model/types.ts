import type { Product } from "@/entities/products";

export interface CartItem {
	product: Product;
	quantity: number;
}
