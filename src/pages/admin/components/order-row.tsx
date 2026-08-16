import { ClipboardList } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "@/features/orders";
import type { OrderResponseDto } from "@/entities/orders";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/shared/lib/format";

interface OrderRowProps {
	order: OrderResponseDto;
}

export function OrderRow({ order }: OrderRowProps) {
	const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<div className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:gap-5 sm:px-6">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 text-primary">
				<ClipboardList className="size-4" />
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="truncate font-semibold text-foreground">
					#{order.orderNumber}
				</span>
				<span className="truncate text-sm text-muted-foreground">
					{formatDate(order.createdAt)} · {itemCount}{" "}
					{itemCount === 1 ? "producto" : "productos"}
				</span>
			</div>

			<div className="hidden w-32 shrink-0 flex-col items-end gap-0.5 md:flex">
				<span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
					Total
				</span>
				<span className="truncate text-sm text-foreground">
					{formatCurrency(order.totals.total)}
				</span>
			</div>

			<div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
				<PaymentStatusBadge status={order.payment.status} />
				<OrderStatusBadge status={order.status} />
			</div>
		</div>
	);
}

export function OrderRowSkeleton() {
	return (
		<div className="flex items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
			<Skeleton className="size-10 shrink-0 rounded-xl" />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="h-3 w-36" />
			</div>
			<Skeleton className="hidden h-8 w-20 md:block" />
			<Skeleton className="h-5 w-20 shrink-0 rounded-full" />
		</div>
	);
}
