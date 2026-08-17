import type { LucideIcon } from "lucide-react";
import { StatCard, StatCardSkeleton } from "./stat-card";

export interface StatDefinition {
	key: string;
	label: string;
	icon: LucideIcon;
	format?: (value: number) => string;
}

const formatCount = (value: number) => value.toLocaleString("es-CO");

function pickNumber(data: unknown, key: string): number | undefined {
	if (typeof data !== "object" || data === null) return undefined;
	const value = (data as Record<string, unknown>)[key];
	return typeof value === "number" ? value : undefined;
}

interface StatsGridProps {
	definitions: StatDefinition[];
	data: unknown;
	isPending: boolean;
	isError: boolean;
	errorMessage?: string;
}

// The dashboard endpoints this reads from (admin + cook) don't document a
// response schema, so each numeric stat is looked up defensively and shows
// "—" instead of breaking if a key is missing or renamed server-side.
export function StatsGrid({
	definitions,
	data,
	isPending,
	isError,
	errorMessage = "No se pudieron cargar las estadísticas.",
}: StatsGridProps) {
	return (
		<>
			{isPending && (
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{definitions.map((stat) => (
						<StatCardSkeleton key={stat.key} />
					))}
				</div>
			)}

			{isError && (
				<p className="mt-4 text-sm text-destructive">{errorMessage}</p>
			)}

			{!isPending && data !== undefined && (
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{definitions.map((stat) => {
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
		</>
	);
}
