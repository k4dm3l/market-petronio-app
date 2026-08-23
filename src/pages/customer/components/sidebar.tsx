import { MapPin, Pencil, Receipt, ShoppingCart } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link } from "react-router";
import { useCart } from "@/entities/cart";
import { useGetMe } from "@/entities/users";
import { OnboardingAddressDialog } from "@/features/address";
import { Separator } from "@/shared/components/ui/separator";
import { DEFAULT_COOK_LOCATION } from "@/shared/config";

interface SidebarProps {
	onOpenCart: () => void;
	/** The filters panel for the current view (products or cooks). */
	children: ReactNode;
}

export function Sidebar({ onOpenCart, children }: SidebarProps) {
	const { itemCount } = useCart();
	const { data: me } = useGetMe();
	const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

	const primaryAddress =
		me?.addresses.find((address) => address.isPrimary) ?? me?.addresses[0];
	const addressText =
		primaryAddress?.address ??
		me?.deliveryInformation?.address ??
		DEFAULT_COOK_LOCATION.publicLocation;

	return (
		<aside className="hidden w-72 shrink-0 border-r border-border lg:block">
			<div className="flex h-full flex-col overflow-y-auto p-6">
				<button
					type="button"
					onClick={() => setIsAddressDialogOpen(true)}
					className="group mb-4 flex items-center gap-2 rounded-lg bg-muted/50 px-2 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
				>
					<MapPin className="size-4 shrink-0" />
					<span className="min-w-0 flex-1 truncate">{addressText}</span>
					<Pencil className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
				</button>

				<OnboardingAddressDialog
					open={isAddressDialogOpen}
					onOpenChange={setIsAddressDialogOpen}
				/>

				<nav className="flex flex-col gap-1">
					<button
						type="button"
						onClick={onOpenCart}
						className="flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
					>
						<span className="flex items-center gap-2">
							<ShoppingCart className="size-4" />
							Mi carrito
						</span>
						{itemCount > 0 && (
							<span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
								{itemCount}
							</span>
						)}
					</button>

					<Link
						to="/my-orders"
						className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
					>
						<Receipt className="size-4" />
						Mis órdenes
					</Link>
				</nav>

				<Separator className="my-6" />

				{children}
			</div>
		</aside>
	);
}
