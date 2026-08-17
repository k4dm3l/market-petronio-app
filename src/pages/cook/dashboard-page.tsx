import { ChefHat, Clock, Package, TrendingUp, Truck } from "lucide-react";
import { useGetCookDashboard } from "@/entities/cooks";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import type { StatDefinition } from "@/shared/components/ui/stats-grid";
import { StatsGrid } from "@/shared/components/ui/stats-grid";
import { formatCurrency } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

const STAT_DEFINITIONS: StatDefinition[] = [
	{ key: "pendingOrders", label: "Pedidos pendientes", icon: Clock },
	{ key: "ordersBeingPrepared", label: "En preparación", icon: ChefHat },
	{ key: "shippedOrders", label: "Enviados", icon: Truck },
	{
		key: "monthlySales",
		label: "Ventas del mes",
		icon: TrendingUp,
		format: formatCurrency,
	},
];

export function CookDashboardPage() {
	const { data, isPending, isError } = useGetCookDashboard();

	return (
		<div>
			<h1 className="text-4xl font-semibold">Dashboard</h1>
			<StatsGrid
				definitions={STAT_DEFINITIONS}
				data={data}
				isPending={isPending}
				isError={isError}
			/>

			{data && data.products.length > 0 && (
				<div className="mt-8">
					<h2 className="mb-3 text-xl font-semibold">Stock de productos</h2>
					<div className="overflow-hidden rounded-2xl border border-border bg-card">
						{data.products.map((product, index) => (
							<div key={product.id}>
								{index > 0 && <Separator />}
								<div className="flex items-center gap-3 px-5 py-4">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 text-primary">
										<Package className="size-4" />
									</div>
									<span className="flex-1 truncate font-medium text-foreground">
										{product.name}
									</span>
									<span className="text-sm text-muted-foreground">
										{product.stock} und.
									</span>
									<Badge
										className={cn(
											"shrink-0 border",
											product.isAvailable
												? "border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
												: "border-transparent bg-muted text-muted-foreground",
										)}
									>
										{product.isAvailable ? "Disponible" : "Oculto"}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
