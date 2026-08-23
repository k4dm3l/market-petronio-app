import { Link } from "react-router";
import type { CustomerOrderHistoryItemDto } from "@/entities/orders";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { OrderStatusBadge } from "./order-status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";

interface OrderListCardProps {
	order: CustomerOrderHistoryItemDto;
	detailHref: string;
}

// Shared between the cook and customer order lists — both read the same
// summary shape from GET /orders (verified: cooks don't get a richer object
// there, see entities/orders/hooks/use-get-orders.ts).
export function OrderListCard({ order, detailHref }: OrderListCardProps) {
	return (
		<li className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<p className="text-sm font-semibold">
					Pedido #{order.id.slice(-6).toUpperCase()}
				</p>
				<p className="text-sm text-muted-foreground">
					{formatDate(order.createdAt)}
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<PaymentStatusBadge status={order.paymentStatus} />
				<OrderStatusBadge status={order.status} />
				<span className="text-sm font-bold">{formatCurrency(order.total)}</span>
				<Button size="sm" variant="outline" render={<Link to={detailHref} />}>
					Ver detalle
				</Button>
			</div>
		</li>
	);
}

export function OrderListCardSkeleton() {
	return (
		<li className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="h-3.5 w-20" />
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<Skeleton className="h-5 w-20 rounded-full" />
				<Skeleton className="h-5 w-24 rounded-full" />
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-8 w-24 rounded-md" />
			</div>
		</li>
	);
}
