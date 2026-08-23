import { Truck } from "lucide-react";
import type { OrderShippingStatus as OrderShippingStatusType } from "@/entities/orders";
import { OrderShippingStatus } from "@/entities/orders";
import { StatusBadge, type StatusMeta } from "./status-badge";

const SHIPPING_STATUS_META: Record<OrderShippingStatusType, StatusMeta> = {
	[OrderShippingStatus.Pending]: {
		label: "Pendiente",
		className:
			"border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
	},
	[OrderShippingStatus.Preparing]: {
		label: "Preparando",
		className:
			"border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
	},
	[OrderShippingStatus.ReadyToShip]: {
		label: "Listo para enviar",
		className:
			"border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
	},
	[OrderShippingStatus.Shipped]: {
		label: "Enviado",
		className:
			"border-sky-600/15 bg-sky-600/10 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-400",
	},
	[OrderShippingStatus.InTransit]: {
		label: "En camino",
		className:
			"border-indigo-600/15 bg-indigo-600/10 text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-400",
	},
	[OrderShippingStatus.Delivered]: {
		label: "Entregado",
		className:
			"border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400",
	},
};

interface ShippingStatusBadgeProps {
	status: OrderShippingStatusType;
}

export function ShippingStatusBadge({ status }: ShippingStatusBadgeProps) {
	return (
		<StatusBadge status={status} meta={SHIPPING_STATUS_META} icon={Truck} />
	);
}
