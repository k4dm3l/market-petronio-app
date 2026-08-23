import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { OrderStatus } from "@/entities/orders";
import { useGetOrders } from "@/entities/orders";
import { OrdersListView } from "@/features/orders";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useDebouncedValue } from "@/shared/hooks";
import { CartSheet, Navbar } from "./components";

export function CustomerOrdersPage() {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	const status = (searchParams.get("status") as OrderStatus | null) ?? "all";
	const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
	const debouncedSearch = useDebouncedValue(searchInput, 400);

	const setStatus = (next: OrderStatus | "all") => {
		setSearchParams(
			(prev) => {
				const params = new URLSearchParams(prev);
				if (next === "all") params.delete("status");
				else params.set("status", next);
				return params;
			},
			{ replace: true },
		);
	};

	// Only pushes to the URL once the user stops typing, so every keystroke
	// doesn't spam a browser history / query-string update.
	useEffect(() => {
		setSearchParams(
			(prev) => {
				const params = new URLSearchParams(prev);
				if (debouncedSearch) params.set("q", debouncedSearch);
				else params.delete("q");
				return params;
			},
			{ replace: true },
		);
	}, [debouncedSearch, setSearchParams]);

	// Status and search are filtered server-side (GET /api/orders), so this
	// only fetches the pages matching the current filters.
	const {
		data,
		isPending: isOrdersPending,
		isError: isOrdersError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetOrders({
		status: status === "all" ? undefined : status,
		search: searchInput,
	});

	const orders = data?.pages.flatMap((page) => page.data) ?? [];

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

					{isOrdersError && (
						<p className="text-sm text-destructive">
							No se pudieron cargar tus pedidos.
						</p>
					)}

					<OrdersListView
						orders={orders}
						detailHrefFor={(id) => `/my-orders/${id}`}
						emptyMessage="Cuando hagas tu primer pedido, lo verás aquí."
						search={searchInput}
						onSearchChange={setSearchInput}
						status={status}
						onStatusChange={setStatus}
						isLoading={isOrdersPending}
						footer={
							hasNextPage && (
								<div className="flex justify-center">
									<Button
										type="button"
										variant="outline"
										onClick={() => fetchNextPage()}
										disabled={isFetchingNextPage}
									>
										{isFetchingNextPage ? (
											<>
												<Spinner className="size-4" />
												Cargando...
											</>
										) : (
											"Cargar más"
										)}
									</Button>
								</div>
							)
						}
					/>
				</div>
			</main>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
