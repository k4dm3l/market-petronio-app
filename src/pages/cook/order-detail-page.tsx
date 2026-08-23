import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import {
	getNextOrderStatus,
	OrderPaymentStatus,
	OrderStatus,
	useGetOrder,
	useUpdateOrderPayment,
	useUpdateOrderStatus,
} from "@/entities/orders";
import { ORDER_STATUS_META, OrderDetailView } from "@/features/orders";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";

export function CookOrderDetailPage() {
	const { id = "" } = useParams();
	const { data: order, isPending: isOrderPending } = useGetOrder(id);
	const updateStatus = useUpdateOrderStatus();
	const updatePayment = useUpdateOrderPayment();

	const isPaid = order?.payment.status === OrderPaymentStatus.Paid;
	const nextStatus = order ? getNextOrderStatus(order.status) : null;
	const isCancelled = order?.status === OrderStatus.Cancelled;
	// Both buttons share the same mutation, so we check `variables` to know
	// which one is actually in flight instead of spinning both at once.
	const isAdvancing =
		updateStatus.isPending &&
		updateStatus.variables?.payload.status === nextStatus;
	const isCancelling =
		updateStatus.isPending &&
		updateStatus.variables?.payload.status === OrderStatus.Cancelled;

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/orders"
				className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Volver a pedidos
			</Link>

			{isOrderPending && (
				<div className="flex flex-col gap-6">
					<Skeleton className="h-10 w-2/3 rounded-lg" />
					<Skeleton className="h-48 rounded-2xl" />
				</div>
			)}

			{!isOrderPending && !order && (
				<p className="text-sm text-muted-foreground">
					Pedido no encontrado.{" "}
					<Link to="/orders" className="underline">
						Volver a pedidos
					</Link>
				</p>
			)}

			{order && (
				<>
					<OrderDetailView order={order} />

					<Separator />

					<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div className="flex flex-col gap-1.5">
							<span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
								Estado del pedido
							</span>
							<div className="flex items-center gap-2">
								{nextStatus && (
									<Button
										type="button"
										disabled={updateStatus.isPending}
										onClick={() =>
											updateStatus.mutate({
												id: order.id,
												payload: { status: nextStatus },
											})
										}
									>
										{isAdvancing ? (
											<>
												<Spinner className="size-4" />
												Actualizando...
											</>
										) : (
											`Marcar como ${ORDER_STATUS_META[nextStatus].label}`
										)}
									</Button>
								)}
								{!nextStatus && (
									<span className="text-sm text-muted-foreground">
										{isCancelled ? "Pedido cancelado" : "Pedido entregado"}
									</span>
								)}
								{!isCancelled && order.status !== OrderStatus.Delivered && (
									<Button
										type="button"
										variant="outline"
										disabled={updateStatus.isPending}
										onClick={() =>
											updateStatus.mutate({
												id: order.id,
												payload: { status: OrderStatus.Cancelled },
											})
										}
									>
										{isCancelling ? (
											<>
												<Spinner className="size-4" />
												Cancelando...
											</>
										) : (
											"Cancelar pedido"
										)}
									</Button>
								)}
							</div>
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
							{updatePayment.isPending ? (
								<>
									<Spinner className="size-4" />
									Actualizando...
								</>
							) : isPaid ? (
								"Marcar como no pagado"
							) : (
								"Marcar como pagado"
							)}
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
