import {
	ChefHat,
	ClipboardList,
	Package,
	Tag,
	TrendingUp,
	Users,
} from "lucide-react";
import { useGetDashboardStats } from "@/entities/stats";
import type { StatDefinition } from "@/shared/components/ui/stats-grid";
import { StatsGrid } from "@/shared/components/ui/stats-grid";
import { formatCurrency } from "@/shared/lib/format";

const STAT_DEFINITIONS: StatDefinition[] = [
	{ key: "activeCooks", label: "Cocineros activos", icon: ChefHat },
	{ key: "registeredCustomers", label: "Clientes registrados", icon: Users },
	{ key: "products", label: "Productos", icon: Package },
	{ key: "orders", label: "Pedidos", icon: ClipboardList },
	{ key: "categories", label: "Categorías", icon: Tag },
	{
		key: "processedSales",
		label: "Ventas procesadas",
		icon: TrendingUp,
		format: formatCurrency,
	},
];

export function AdminDashboardPage() {
	const { data, isPending, isError } = useGetDashboardStats();

	return (
		<div>
			<h1 className="text-4xl font-semibold">Dashboard</h1>
			<StatsGrid
				definitions={STAT_DEFINITIONS}
				data={data}
				isPending={isPending}
				isError={isError}
			/>
		</div>
	);
}
