import { LogOut, Receipt, ShoppingBag, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "@/entities/cart";
import { useAuth } from "@/entities/session";
import { useGetMe } from "@/entities/users";
import { OnboardingAddressDialog } from "@/features/address";
import { Button } from "@/shared/components/ui/button";
import { STORAGE_KEYS } from "@/shared/config";
import { Storage } from "@/shared/lib/storage";

interface NavbarProps {
	onOpenCart: () => void;
}

export function Navbar({ onOpenCart }: NavbarProps) {
	const { user, signOut } = useAuth();
	const { itemCount } = useCart();
	const { data: me } = useGetMe();
	const [dismissed, setDismissed] = useState(() =>
		Boolean(Storage.get(STORAGE_KEYS.addressOnboardingDismissed)),
	);

	const hasAddress =
		Boolean(me?.addresses.length) || Boolean(me?.deliveryInformation);
	// Opens once per customer, right after the profile loads, when there's
	// no saved address yet. Dismissing it persists a flag so it doesn't
	// reopen on every page (Navbar remounts per route).
	const isAddressDialogOpen = Boolean(me) && !hasAddress && !dismissed;

	const closeAddressDialog = (open: boolean) => {
		if (open) return;
		setDismissed(true);
		Storage.set(STORAGE_KEYS.addressOnboardingDismissed, true);
	};

	return (
		<>
			<header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-4 sm:px-6 lg:px-8">
				<div className="flex w-full items-center justify-between">
					<Link to="/search" className="flex items-center gap-2 text-primary">
						<ShoppingBag className="size-5" />
						<span className="text-lg font-bold tracking-tight">
							Petronio Market
						</span>
					</Link>

					<div className="flex items-center gap-1 lg:gap-3">
						{user && (
							<span className="hidden text-sm text-muted-foreground sm:inline">
								Hola, {user.name.split(" ")[0]}
							</span>
						)}

						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="relative lg:hidden"
							onClick={onOpenCart}
							aria-label="Abrir carrito"
						>
							<ShoppingCart className="size-5" />
							{itemCount > 0 && (
								<span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
									{itemCount}
								</span>
							)}
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							render={<Link to="/my-orders" aria-label="Mis órdenes" />}
						>
							<Receipt className="size-5" />
						</Button>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={signOut}
							aria-label="Cerrar sesión"
						>
							<LogOut className="size-5" />
						</Button>
					</div>
				</div>
			</header>

			<OnboardingAddressDialog
				open={isAddressDialogOpen}
				onOpenChange={closeAddressDialog}
			/>
		</>
	);
}
