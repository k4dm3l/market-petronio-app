import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { useGetOrder } from "@/entities/orders";
import { OrderDetailView } from "@/features/orders";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CartSheet, Navbar } from "./components";

// Read-only: unlike the cook detail page, customers don't get status/payment
// controls here — just the order info.
export function CustomerOrderDetailPage() {
	const { id = "" } = useParams();
	const [isCartOpen, setIsCartOpen] = useState(false);
	const { data: order, isPending: isOrderPending } = useGetOrder(id);

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<Navbar onOpenCart={() => setIsCartOpen(true)} />

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
					<Link
						to="/my-orders"
						className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-4" />
						Volver a mis órdenes
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
							<Link to="/my-orders" className="underline">
								Volver a mis órdenes
							</Link>
						</p>
					)}

					{order && (
						<div className="flex flex-col gap-6">
							<OrderDetailView order={order} />
						</div>
					)}
				</div>
			</main>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
