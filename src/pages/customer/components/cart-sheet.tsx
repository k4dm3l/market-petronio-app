import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import { useCart } from "@/entities/cart";
import { Button } from "@/shared/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/shared/components/ui/sheet";
import { formatCurrency } from "@/shared/lib/format";
import { CartLineItem } from "./cart-line-item";

interface CartSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
	const { items, subtotal, clear } = useCart();
	const navigate = useNavigate();
	const hasItems = items.length > 0;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="flex w-full max-w-sm flex-col gap-0 p-0"
			>
				<SheetHeader className="border-b border-border">
					<SheetTitle>Tu carrito</SheetTitle>
				</SheetHeader>

				{hasItems ? (
					<ul className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
						{items.map((item) => (
							<CartLineItem key={item.product.id} item={item} />
						))}
					</ul>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
						<ShoppingCart className="size-10 text-muted-foreground" />
						<p className="text-sm font-medium">Tu carrito está vacío</p>
						<p className="text-sm text-muted-foreground">
							Agrega platos del catálogo para verlos aquí.
						</p>
					</div>
				)}

				<SheetFooter className="border-t border-border">
					{hasItems && (
						<>
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
						</>
					)}
					<Button
						type="button"
						className="w-full"
						disabled={!hasItems}
						onClick={() => {
							onOpenChange(false);
							navigate("/checkout");
						}}
					>
						Ordenar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
