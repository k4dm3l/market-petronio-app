import { Receipt, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "@/entities/cart";
import type { Category } from "@/entities/categories";
import { Separator } from "@/shared/components/ui/separator";
import type { ProductFilters } from "../filters";
import { FiltersPanel } from "./filters-panel";

interface SidebarProps {
	categories: Category[];
	tags: string[];
	filters: ProductFilters;
	onChange: (filters: ProductFilters) => void;
	onClear: () => void;
	hasActiveFilters: boolean;
	onOpenCart: () => void;
}

export function Sidebar({
	categories,
	tags,
	filters,
	onChange,
	onClear,
	hasActiveFilters,
	onOpenCart,
}: SidebarProps) {
	const { itemCount } = useCart();

	return (
		<aside className="hidden w-72 shrink-0 border-r border-border lg:block">
			<div className="flex h-full flex-col overflow-y-auto p-6">
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

				<FiltersPanel
					categories={categories}
					tags={tags}
					filters={filters}
					onChange={onChange}
					onClear={onClear}
					hasActiveFilters={hasActiveFilters}
				/>
			</div>
		</aside>
	);
}
