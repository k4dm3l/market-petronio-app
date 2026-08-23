import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { CartItem } from "@/entities/cart";
import { useGetCook } from "@/entities/cooks";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";
import { formatCurrency } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { CartLineItem } from "./cart-line-item";

export type CookOrderStatus = "idle" | "pending" | "success" | "error";

interface CookOrderCardProps {
	cookId: string;
	items: CartItem[];
	status: CookOrderStatus;
	errorMessage?: string;
	disabled?: boolean;
}

function getSubtotal(items: CartItem[]): number {
	return items.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0,
	);
}

export function CookOrderCard({
	cookId,
	items,
	status,
	errorMessage,
	disabled = false,
}: CookOrderCardProps) {
	const { data: cook, isLoading: isCookLoading } = useGetCook(cookId);
	const subtotal = getSubtotal(items);

	return (
		<div
			className={cn(
				"rounded-2xl border p-4 transition-colors",
				status === "success" && "border-emerald-600/30 bg-emerald-600/5",
				status === "error" && "border-destructive/30 bg-destructive/5",
				status === "idle" || status === "pending" ? "border-border" : undefined,
			)}
		>
			<div className="mb-3 flex items-center justify-between gap-2">
				{isCookLoading ? (
					<Skeleton className="h-5 w-32" />
				) : (
					<span className="text-sm font-semibold">
						{cook?.displayName ?? "Cocinera"}
					</span>
				)}

				{status === "pending" && (
					<Badge
						variant="outline"
						className="gap-1 border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400"
					>
						<Spinner className="size-3" />
						Enviando
					</Badge>
				)}
				{status === "success" && (
					<Badge
						variant="outline"
						className="gap-1 border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
					>
						<CheckCircle2 className="size-3" />
						Confirmado
					</Badge>
				)}
				{status === "error" && (
					<Badge
						variant="outline"
						className="gap-1 border-destructive/15 bg-destructive/10 text-destructive"
					>
						<AlertCircle className="size-3" />
						Error
					</Badge>
				)}
			</div>

			{status === "success" ? (
				<p className="text-sm text-muted-foreground">
					{items.length} {items.length === 1 ? "producto" : "productos"} ·{" "}
					{formatCurrency(subtotal)}
				</p>
			) : (
				<>
					<ul className="flex flex-col gap-4">
						{items.map((item) => (
							<CartLineItem
								key={item.product.id}
								item={item}
								disabled={disabled}
							/>
						))}
					</ul>

					{status === "error" && errorMessage && (
						<p className="mt-3 text-xs text-destructive">{errorMessage}</p>
					)}

					<div className="mt-4 flex items-center justify-between border-t border-border pt-3">
						<span className="text-sm text-muted-foreground">Subtotal</span>
						<span className="text-sm font-semibold">
							{formatCurrency(subtotal)}
						</span>
					</div>
				</>
			)}
		</div>
	);
}
