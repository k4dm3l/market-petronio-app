import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { OrdersListView } from "@/features/orders";
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

					<OrdersListView
						orders={MOCK_ORDERS}
						detailHrefFor={(id) => `/my-orders/${id}`}
						emptyMessage="Cuando hagas tu primer pedido, lo verás aquí."
					/>
				</div>
			</main>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
