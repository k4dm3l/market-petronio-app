import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { OrderStatusBadge, PaymentStatusBadge } from "@/features/orders";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { CartSheet, Navbar } from "./components";
import { MOCK_ORDERS } from "./mock-orders";

export function CustomerOrdersPage() {
	const [isCartOpen, setIsCartOpen] = useState(false);

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<Navbar onOpenCart={() => setIsCartOpen(true)} />

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
					<Link
						to="/search"
						className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-4" />
						Volver al catálogo
					</Link>

					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Mis órdenes
						</h1>
						<p className="mt-2 text-muted-foreground">
							Revisa el estado de tus pedidos anteriores.
						</p>
					</div>

					{MOCK_ORDERS.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border py-16 text-center">
							<p className="text-sm font-medium">Aún no tienes pedidos</p>
							<p className="text-sm text-muted-foreground">
								Cuando hagas tu primer pedido, lo verás aquí.
							</p>
						</div>
					) : (
						<ul className="flex flex-col gap-3">
							{MOCK_ORDERS.map((order) => (
								<li
									key={order.id}
									className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
								>
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
										<span className="text-sm font-bold">
											{formatCurrency(order.total)}
										</span>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</main>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
