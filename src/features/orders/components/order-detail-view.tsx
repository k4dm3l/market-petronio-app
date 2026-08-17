import type { OrderResponseDto } from "@/entities/orders";
import { Separator } from "@/shared/components/ui/separator";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { OrderStatusBadge } from "./order-status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";
import { ShippingStatusBadge } from "./shipping-status-badge";

interface OrderDetailViewProps {
	order: OrderResponseDto;
}

// Read-only order info — shared by the cook detail page (which adds status
// controls after this) and the customer detail page (info only, no controls).
export function OrderDetailView({ order }: OrderDetailViewProps) {
	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Pedido #{order.orderNumber}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{formatDate(order.createdAt)}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<PaymentStatusBadge status={order.payment.status} />
					<OrderStatusBadge status={order.status} />
					<ShippingStatusBadge status={order.shipping.status} />
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-3">
				<h2 className="text-sm font-semibold">Productos</h2>
				<ul className="flex flex-col gap-2">
					{order.items.map((item) => (
						<li
							key={item.productId}
							className="flex items-center justify-between text-sm"
						>
							<span className="text-foreground">
								{item.quantity}× {item.name}
							</span>
							<span className="font-medium text-foreground">
								{formatCurrency(item.total)}
							</span>
						</li>
					))}
				</ul>

				<Separator />

				<div className="flex flex-col gap-1 text-sm">
					<div className="flex justify-between text-muted-foreground">
						<span>Subtotal</span>
						<span>{formatCurrency(order.totals.subtotal)}</span>
					</div>
					<div className="flex justify-between text-muted-foreground">
						<span>Envío</span>
						<span>{formatCurrency(order.totals.shipping)}</span>
					</div>
					<div className="flex justify-between text-base font-bold text-foreground">
						<span>Total</span>
						<span>{formatCurrency(order.totals.total)}</span>
					</div>
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-2">
				<h2 className="text-sm font-semibold">Entrega</h2>
				<p className="text-sm text-foreground">{order.delivery.address}</p>
				{order.delivery.additionalInformation && (
					<p className="text-sm text-muted-foreground">
						{order.delivery.additionalInformation}
					</p>
				)}
			</div>
		</>
	);
}
