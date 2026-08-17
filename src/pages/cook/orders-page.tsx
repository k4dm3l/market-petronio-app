import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { OrderStatus } from "@/entities/orders";
import { useGetOrders } from "@/entities/orders";
import {
	ORDER_STATUS_META,
	OrderStatusBadge,
	PaymentStatusBadge,
} from "@/features/orders";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDebouncedValue } from "@/shared/hooks";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
	{ value: "all", label: "Todos" },
	...(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((status) => ({
		value: status,
		label: ORDER_STATUS_META[status].label,
	})),
];

function normalize(value: string) {
	return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function CookOrdersPage() {
	const { data, isPending, isError } = useGetOrders();
	const [searchParams, setSearchParams] = useSearchParams();

	const status = searchParams.get("status") ?? "all";
	const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
	const debouncedSearch = useDebouncedValue(searchInput, 400);

	const setStatus = (next: string) => {
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

	const filtered = useMemo(() => {
		if (!data) return [];
		const q = normalize(searchInput.trim());
		return data.filter((order) => {
			const matchesStatus = status === "all" || order.status === status;
			const matchesQuery = !q || normalize(order.orderNumber).includes(q);
			return matchesStatus && matchesQuery;
		});
	}, [data, status, searchInput]);

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-4xl font-semibold">Pedidos</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					{data === undefined
						? "Cargando tus pedidos..."
						: `${filtered.length} de ${data.length} pedidos`}
				</p>
			</div>

			<div className="relative">
				<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={searchInput}
					onChange={(event) => setSearchInput(event.target.value)}
					placeholder="Buscar por número de pedido"
					className="w-full pl-9"
					aria-label="Buscar pedidos"
				/>
			</div>

			<div className="flex gap-2 overflow-x-auto pb-1">
				{STATUS_FILTERS.map((filter) => {
					const isActive = status === filter.value;
					return (
						<button
							key={filter.value}
							type="button"
							onClick={() => setStatus(filter.value)}
							className={cn(
								"h-12 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
								isActive
									? "border-transparent bg-primary text-primary-foreground"
									: "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							{filter.label}
						</button>
					);
				})}
			</div>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar tus pedidos.
				</p>
			)}

			{data !== undefined && filtered.length === 0 && (
				<div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border py-16 text-center">
					<p className="text-sm font-medium">No se encontraron pedidos</p>
					<p className="text-sm text-muted-foreground">
						{searchInput || status !== "all"
							? "Prueba con otro filtro o número de pedido."
							: "Cuando recibas un pedido, lo verás aquí."}
					</p>
				</div>
			)}

			{filtered.length > 0 && (
				<ul className="flex flex-col gap-3">
					{filtered.map((order) => {
						const itemCount = order.items.reduce(
							(sum, item) => sum + item.quantity,
							0,
						);
						return (
							<li
								key={order.id}
								className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
							>
								<div>
									<p className="text-sm font-semibold">
										Pedido #{order.orderNumber}
									</p>
									<p className="text-sm text-muted-foreground">
										{formatDate(order.createdAt)} · {itemCount}{" "}
										{itemCount === 1 ? "producto" : "productos"}
									</p>
								</div>

								<div className="flex flex-wrap items-center gap-2">
									<PaymentStatusBadge status={order.payment.status} />
									<OrderStatusBadge status={order.status} />
									<span className="text-sm font-bold">
										{formatCurrency(order.totals.total)}
									</span>
									<Button
										size="sm"
										variant="outline"
										render={<Link to={`/orders/${order.id}`} />}
									>
										Ver detalle
									</Button>
								</div>
							</li>
						);
					})}
				</ul>
			)}

			{isPending && (
				<p className="text-sm text-muted-foreground">Cargando pedidos...</p>
			)}
		</div>
	);
}
