import type { Cook } from "@/entities/cooks";
import { CookCard } from "@/features/cooks";

interface CookGridProps {
	cooks: Cook[];
}

export function CookGrid({ cooks }: CookGridProps) {
	if (cooks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border py-16 text-center">
				<p className="text-sm font-medium">No encontramos cocineras</p>
				<p className="text-sm text-muted-foreground">
					Prueba ajustando los filtros o busca otro nombre.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{cooks.map((cook) => (
				<CookCard key={cook.id} cook={cook} />
			))}
		</div>
	);
}
