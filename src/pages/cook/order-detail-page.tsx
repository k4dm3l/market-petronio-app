import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import {
	OrderPaymentStatus,
	OrderStatus,
	useGetOrder,
	useUpdateOrderPayment,
	useUpdateOrderStatus,
} from "@/entities/orders";
import {
	ORDER_STATUS_META,
	OrderStatusBadge,
	PaymentStatusBadge,
	ShippingStatusBadge,
} from "@/features/orders";
import { Button } from "@/shared/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { getErrorMessage } from "@/shared/lib/error";
import { formatCurrency, formatDate } from "@/shared/lib/format";

export function CookOrderDetailPage() {
	const { id = "" } = useParams();
	const { data: order, isPending, isError } = useGetOrder(id);
	const updateStatus = useUpdateOrderStatus();
	const updatePayment = useUpdateOrderPayment();

	const isPaid = order?.payment.status === OrderPaymentStatus.Paid;

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/orders"
				className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Volver a pedidos
			</Link>

			{isPending && (
				<p className="text-sm text-muted-foreground">Cargando pedido...</p>
			)}

			{isError && (
				<p className="text-sm text-destructive">No se pudo cargar el pedido.</p>
			)}

			{order && (
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

					<Separator />

					<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div className="flex flex-col gap-1.5">
							<span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
								Estado del pedido
							</span>
							<Select
								value={order.status}
								onValueChange={(value) =>
									updateStatus.mutate({
										id: order.id,
										payload: { status: value as OrderStatus },
									})
								}
							>
								<SelectTrigger className="w-56">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map(
										(value) => (
											<SelectItem key={value} value={value}>
												{ORDER_STATUS_META[value].label}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
						</div>

						<Button
							type="button"
							variant={isPaid ? "outline" : "default"}
							disabled={updatePayment.isPending}
							onClick={() =>
								updatePayment.mutate({
									id: order.id,
									payload: {
										status: isPaid
											? OrderPaymentStatus.Pending
											: OrderPaymentStatus.Paid,
									},
								})
							}
						>
							{isPaid ? "Marcar como no pagado" : "Marcar como pagado"}
						</Button>
					</div>

					{(updateStatus.isError || updatePayment.isError) && (
						<p className="text-sm text-destructive">
							{getErrorMessage(updateStatus.error ?? updatePayment.error)}
						</p>
					)}
				</>
			)}
		</div>
	);
}
