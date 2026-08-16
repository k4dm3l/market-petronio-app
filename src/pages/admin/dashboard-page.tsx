import {
	ChefHat,
	ClipboardList,
	type LucideIcon,
	Package,
	Tag,
	TrendingUp,
	Users,
} from "lucide-react";
import { useGetDashboardStats } from "@/entities/stats";
import { formatCurrency } from "@/shared/lib/format";
import { StatCard, StatCardSkeleton } from "./components";

interface StatDefinition {
	key: string;
	label: string;
	icon: LucideIcon;
	format?: (value: number) => string;
}

const formatCount = (value: number) => value.toLocaleString("es-CO");

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

function pickNumber(data: unknown, key: string): number | undefined {
	if (typeof data !== "object" || data === null) return undefined;
	const value = (data as Record<string, unknown>)[key];
	return typeof value === "number" ? value : undefined;
}

export function AdminDashboardPage() {
	const { data, isPending, isError } = useGetDashboardStats();

	return (
		<div>
			<h1 className="text-4xl font-semibold">Dashboard</h1>

			{isPending && (
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{STAT_DEFINITIONS.map((stat) => (
						<StatCardSkeleton key={stat.key} />
					))}
				</div>
			)}
			{isError && (
				<p className="mt-4 text-sm text-destructive">
					No se pudieron cargar las estadísticas.
				</p>
			)}

			{data !== undefined && (
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{STAT_DEFINITIONS.map((stat) => {
						const raw = pickNumber(data, stat.key);
						const value =
							raw === undefined ? "—" : (stat.format ?? formatCount)(raw);
						return (
							<StatCard
								key={stat.key}
								icon={stat.icon}
								label={stat.label}
								value={value}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
