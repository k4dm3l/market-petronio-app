import { Search } from "lucide-react";
import type { ReactNode } from "react";
import type {
	CustomerOrderHistoryItemDto,
	OrderStatus,
} from "@/entities/orders";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { OrderListCard, OrderListCardSkeleton } from "./order-list-card";
import { ORDER_STATUS_META } from "./order-status-badge";

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
	{ value: "all", label: "Todos" },
	...(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((status) => ({
		value: status,
		label: ORDER_STATUS_META[status].label,
	})),
];

interface OrdersListViewProps {
	// Already filtered/paginated by the caller — status and search are
	// applied server-side (GET /api/orders), this view is presentational.
	orders: CustomerOrderHistoryItemDto[];
	detailHrefFor: (id: string) => string;
	emptyMessage: string;
	search: string;
	onSearchChange: (search: string) => void;
	status: OrderStatus | "all";
	onStatusChange: (status: OrderStatus | "all") => void;
	// True while the first page is loading — search input and status chips
	// stay interactive, only the list area swaps for skeleton cards.
	isLoading?: boolean;
	// Slot for a "Cargar más" button when the caller paginates.
	footer?: ReactNode;
}

// Shared search + status filter + list, reused by both the cook and
// customer order lists — only the data source, detail link, and
// surrounding page chrome differ between them.
export function OrdersListView({
	orders,
	detailHrefFor,
	emptyMessage,
	search,
	onSearchChange,
	status,
	onStatusChange,
	isLoading = false,
	footer,
}: OrdersListViewProps) {
	return (
		<div className="flex flex-col gap-6">
			<p className="text-sm text-muted-foreground">
				{orders.length} pedidos cargados
			</p>

			<div className="relative">
				<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
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
							onClick={() => onStatusChange(filter.value)}
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

			{isLoading && (
				<ul className="flex flex-col gap-3">
					{Array.from({ length: 4 }).map((_, index) => (
						<OrderListCardSkeleton key={index} />
					))}
				</ul>
			)}

			{!isLoading && orders.length === 0 && (
				<div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border py-16 text-center">
					<p className="text-sm font-medium">No se encontraron pedidos</p>
					<p className="text-sm text-muted-foreground">
						{search || status !== "all"
							? "Prueba con otro filtro o número de pedido."
							: emptyMessage}
					</p>
				</div>
			)}

			{!isLoading && orders.length > 0 && (
				<ul className="flex flex-col gap-3">
					{orders.map((order) => (
						<OrderListCard
							key={order.id}
							order={order}
							detailHref={detailHrefFor(order.id)}
						/>
					))}
				</ul>
			)}

			{!isLoading && footer}
		</div>
	);
}
