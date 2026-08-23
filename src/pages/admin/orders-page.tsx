import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { OrderStatus } from "@/entities/orders";
import { useGetAllOrdersInfinite } from "@/entities/orders";
import { OrdersListView } from "@/features/orders";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useDebouncedValue } from "@/shared/hooks";

export function AdminOrdersPage() {
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

	// Status and search are filtered server-side (GET /api/admin/orders), so
	// this only fetches the pages matching the current filters.
	const {
		data,
		isPending,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetAllOrdersInfinite({
		status: status === "all" ? undefined : status,
		search: searchInput,
	});

	// OrdersListView works on the { id, status, paymentStatus, total,
	// createdAt } summary shape (shared with the cook/customer order lists);
	// admin's full OrderResponseDto is trimmed down to match.
	const orders = (data?.pages.flatMap((page) => page.data) ?? []).map(
		(order) => ({
			id: order.id,
			status: order.status,
			paymentStatus: order.payment.status,
			total: order.totals.total,
			createdAt: order.createdAt,
		}),
	);

	return (
		<div>
			<h1 className="mb-6 text-4xl font-semibold">Pedidos</h1>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar los pedidos.
				</p>
			)}

			<OrdersListView
				orders={orders}
				detailHrefFor={(id) => `/admin/orders/${id}`}
				emptyMessage="Aún no hay pedidos registrados."
				search={searchInput}
				onSearchChange={setSearchInput}
				status={status}
				onStatusChange={setStatus}
				isLoading={isPending}
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
	);
}
