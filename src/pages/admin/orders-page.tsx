import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAllOrders } from "@/entities/orders";
import { Separator } from "@/shared/components/ui/separator";
import { AdminListHeader, OrderRow, OrderRowSkeleton } from "./components";

function normalize(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "");
}

export function AdminOrdersPage() {
	const { data, isPending, isError } = useGetAllOrders();
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		if (!data) return [];
		const q = normalize(query.trim());
		if (!q) return data;
		return data.filter((order) => normalize(order.orderNumber).includes(q));
	}, [data, query]);

	return (
		<div>
			<AdminListHeader
				title="Pedidos"
				description={
					data === undefined
						? "Cargando el listado de pedidos..."
						: `${data.length} pedidos registrados`
				}
				searchValue={query}
				onSearchChange={setQuery}
				searchPlaceholder="Buscar por número de pedido"
				searchAriaLabel="Buscar pedidos"
			/>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar los pedidos.
				</p>
			)}

			{isPending && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index}>
							{index > 0 && <Separator />}
							<OrderRowSkeleton />
						</div>
					))}
				</div>
			)}

			{data !== undefined && filtered.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{filtered.map((order, index) => (
						<div key={order.id}>
							{index > 0 && <Separator />}
							<OrderRow order={order} />
						</div>
					))}
				</div>
			)}

			{data !== undefined && filtered.length === 0 && (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
					<div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
						<ClipboardList className="size-5" />
					</div>
					<div>
						<p className="font-medium text-foreground">
							No se encontraron pedidos
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{query
								? "Prueba con otro número de pedido."
								: "Aún no hay pedidos registrados."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
