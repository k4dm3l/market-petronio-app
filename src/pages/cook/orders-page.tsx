import { OrdersListView } from "@/features/orders";
import { MOCK_ORDERS } from "./mock-orders";

export function CookOrdersPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-4xl font-semibold">Pedidos</h1>
			<OrdersListView
				orders={MOCK_ORDERS}
				detailHrefFor={(id) => `/orders/${id}`}
				emptyMessage="Cuando recibas un pedido, lo verás aquí."
			/>
		</div>
	);
}
