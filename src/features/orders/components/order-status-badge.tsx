import type { OrderStatus as OrderStatusType } from "@/entities/orders";
import { OrderStatus } from "@/entities/orders";
import { StatusBadge, type StatusMeta } from "./status-badge";

export const ORDER_STATUS_META: Record<OrderStatusType, StatusMeta> = {
	[OrderStatus.Pending]: {
		label: "Pendiente",
		className: "border-transparent bg-muted text-muted-foreground",
	},
	[OrderStatus.Confirmed]: {
		label: "Confirmado",
		className:
			"border-sky-600/15 bg-sky-600/10 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-400",
	},
	[OrderStatus.Preparing]: {
		label: "Preparando",
		className:
			"border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
	},
	[OrderStatus.ReadyToShip]: {
		label: "Listo para enviar",
		className:
			"border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
	},
	[OrderStatus.Shipped]: {
		label: "Enviado",
		className:
			"border-sky-600/15 bg-sky-600/10 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-400",
	},
	[OrderStatus.Delivered]: {
		label: "Entregado",
		className:
			"border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400",
	},
	[OrderStatus.Cancelled]: {
		label: "Cancelado",
		className: "border-destructive/15 bg-destructive/10 text-destructive",
	},
};

interface OrderStatusBadgeProps {
	status: OrderStatusType;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
	return <StatusBadge status={status} meta={ORDER_STATUS_META} />;
}
