import {
	Minus,
	Plus,
	ShoppingCart,
	Trash2,
	UtensilsCrossed,
} from "lucide-react";
import { useCart } from "@/entities/cart";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/shared/components/ui/sheet";
import { formatCurrency } from "@/shared/lib/format";

interface CartSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
	const { items, subtotal, setQuantity, removeItem, clear } = useCart();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="flex w-full max-w-sm flex-col gap-0 p-0"
			>
				<SheetHeader className="border-b border-border">
					<SheetTitle>Tu carrito</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
						<ShoppingCart className="size-10 text-muted-foreground" />
						<p className="text-sm font-medium">Tu carrito está vacío</p>
						<p className="text-sm text-muted-foreground">
							Agrega platos del catálogo para verlos aquí.
						</p>
					</div>
				) : (
					<ul className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
						{items.map((item) => (
							<li key={item.product.id} className="flex gap-3">
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
											onClick={() =>
												setQuantity(item.product.id, item.quantity - 1)
											}
											aria-label={`Disminuir cantidad de ${item.product.name}`}
											className="flex size-6 items-center justify-center rounded-md border border-input hover:bg-muted"
										>
											<Minus className="size-3" />
										</button>
										<span className="w-6 text-center text-sm">
											{item.quantity}
										</span>
										<button
											type="button"
											onClick={() =>
												setQuantity(item.product.id, item.quantity + 1)
											}
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
						))}
					</ul>
				)}

				{items.length > 0 && (
					<SheetFooter className="border-t border-border">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Subtotal</span>
							<span className="text-base font-bold">
								{formatCurrency(subtotal)}
							</span>
						</div>
						<button
							type="button"
							onClick={clear}
							className="self-start text-xs font-medium text-accent hover:text-accent/80"
						>
							Vaciar carrito
						</button>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
}
