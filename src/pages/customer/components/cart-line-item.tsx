import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import type { CartItem } from "@/entities/cart";
import { useCart } from "@/entities/cart";
import { formatCurrency } from "@/shared/lib/format";

interface CartLineItemProps {
	item: CartItem;
}

export function CartLineItem({ item }: CartLineItemProps) {
	const { setQuantity, removeItem } = useCart();

	return (
		<li className="flex gap-3">
			<div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
				{item.product.images[0] ? (
					<img
						src={item.product.images[0].url}
						alt={item.product.name}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<UtensilsCrossed className="size-5 text-primary/40" />
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-1">
				<div className="flex items-start justify-between gap-2">
					<span className="text-sm leading-tight font-medium">
						{item.product.name}
					</span>
					<button
						type="button"
						onClick={() => removeItem(item.product.id)}
						aria-label={`Eliminar ${item.product.name} del carrito`}
						className="shrink-0 text-muted-foreground hover:text-destructive"
					>
						<Trash2 className="size-4" />
					</button>
				</div>
				<span className="text-xs text-muted-foreground">
					{formatCurrency(item.product.price)} c/u
				</span>

				<div className="mt-1 flex items-center gap-2">
					<button
						type="button"
						onClick={() => setQuantity(item.product.id, item.quantity - 1)}
						aria-label={`Disminuir cantidad de ${item.product.name}`}
						className="flex size-6 items-center justify-center rounded-md border border-input hover:bg-muted"
					>
						<Minus className="size-3" />
					</button>
					<span className="w-6 text-center text-sm">{item.quantity}</span>
					<button
						type="button"
						onClick={() => setQuantity(item.product.id, item.quantity + 1)}
						aria-label={`Aumentar cantidad de ${item.product.name}`}
						className="flex size-6 items-center justify-center rounded-md border border-input hover:bg-muted"
					>
						<Plus className="size-3" />
					</button>

					<span className="ml-auto text-sm font-semibold">
						{formatCurrency(item.product.price * item.quantity)}
					</span>
				</div>
			</div>
		</li>
	);
}
