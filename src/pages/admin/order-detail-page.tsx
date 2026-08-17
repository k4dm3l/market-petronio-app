import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import {
	OrderPaymentStatus,
	type OrderStatus,
	useGetOrder,
	useUpdateOrderPayment,
	useUpdateOrderStatus,
} from "@/entities/orders";
import { ORDER_STATUS_META, OrderDetailView } from "@/features/orders";
import { Button } from "@/shared/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";

export function AdminOrderDetailPage() {
	const { id = "" } = useParams();
	const { data: order, isPending, isError } = useGetOrder(id);
	const updateStatus = useUpdateOrderStatus();
	const updatePayment = useUpdateOrderPayment();

	const isPaid = order?.payment.status === OrderPaymentStatus.Paid;

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/admin/orders"
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
					<OrderDetailView order={order} />

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
				</>
			)}
		</div>
	);
}
