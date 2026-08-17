import { useMemo } from "react";
import { useGetAllOrders } from "@/entities/orders";
import { OrdersListView } from "@/features/orders";

export function AdminOrdersPage() {
	const { data, isPending, isError } = useGetAllOrders();

	// OrdersListView works on the { id, status, paymentStatus, total,
	// createdAt } summary shape (shared with the cook/customer order lists);
	// admin's full OrderResponseDto[] is trimmed down to match.
	const orders = useMemo(
		() =>
			(data ?? []).map((order) => ({
				id: order.id,
				status: order.status,
				paymentStatus: order.payment.status,
				total: order.totals.total,
				createdAt: order.createdAt,
			})),
		[data],
	);

	return (
		<div>
			<h1 className="mb-6 text-4xl font-semibold">Pedidos</h1>

			{isPending && (
				<p className="text-sm text-muted-foreground">Cargando pedidos...</p>
			)}

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar los pedidos.
				</p>
			)}

			{data !== undefined && (
				<OrdersListView
					orders={orders}
					detailHrefFor={(id) => `/admin/orders/${id}`}
					emptyMessage="Aún no hay pedidos registrados."
				/>
			)}
		</div>
	);
}
