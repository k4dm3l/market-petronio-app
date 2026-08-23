import { CreditCard } from "lucide-react";
import type { OrderPaymentStatus as OrderPaymentStatusType } from "@/entities/orders";
import { OrderPaymentStatus } from "@/entities/orders";
import { StatusBadge, type StatusMeta } from "./status-badge";

const PAYMENT_STATUS_META: Record<OrderPaymentStatusType, StatusMeta> = {
	[OrderPaymentStatus.Pending]: {
		label: "Pago pendiente",
		className:
			"border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
	},
	[OrderPaymentStatus.PaymentInstructions]: {
		label: "Esperando pago",
		className:
			"border-amber-600/15 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
	},
	[OrderPaymentStatus.Paid]: {
		label: "Pagado",
		className:
			"border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400",
	},
	[OrderPaymentStatus.Failed]: {
		label: "Pago fallido",
		className: "border-destructive/15 bg-destructive/10 text-destructive",
	},
	[OrderPaymentStatus.Cancelled]: {
		label: "Cancelado",
		className: "border-transparent bg-muted text-muted-foreground",
	},
};

interface PaymentStatusBadgeProps {
	status: OrderPaymentStatusType;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
	return (
		<StatusBadge status={status} meta={PAYMENT_STATUS_META} icon={CreditCard} />
	);
}
