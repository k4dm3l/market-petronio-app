import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { CartItem } from "@/entities/cart/model/types";
import type { Product } from "@/entities/products";

interface CartContextValue {
	items: CartItem[];
	itemCount: number;
	subtotal: number;
	addItem: (product: Product, quantity?: number) => void;
	removeItem: (productId: string) => void;
	setQuantity: (productId: string, quantity: number) => void;
	clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	const addItem = useCallback((product: Product, quantity = 1) => {
		setItems((prev) => {
			const existing = prev.find((item) => item.product.id === product.id);
			if (existing) {
				return prev.map((item) =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item,
				);
			}
			return [...prev, { product, quantity }];
		});
	}, []);

	const removeItem = useCallback((productId: string) => {
		setItems((prev) => prev.filter((item) => item.product.id !== productId));
	}, []);

	const setQuantity = useCallback((productId: string, quantity: number) => {
		setItems((prev) => {
			if (quantity <= 0) {
				return prev.filter((item) => item.product.id !== productId);
			}
			return prev.map((item) =>
				item.product.id === productId ? { ...item, quantity } : item,
			);
		});
	}, []);

	const clear = useCallback(() => setItems([]), []);

	const itemCount = useMemo(
		() => items.reduce((total, item) => total + item.quantity, 0),
		[items],
	);

	const subtotal = useMemo(
		() =>
			items.reduce(
				(total, item) => total + item.product.price * item.quantity,
				0,
			),
		[items],
	);

	const value = useMemo<CartContextValue>(
		() => ({
			items,
			itemCount,
			subtotal,
			addItem,
			removeItem,
			setQuantity,
			clear,
		}),
		[items, itemCount, subtotal, addItem, removeItem, setQuantity, clear],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
