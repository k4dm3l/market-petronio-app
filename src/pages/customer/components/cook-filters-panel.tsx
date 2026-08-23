import { badgeVariants } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { CookFilters } from "../cook-filters";

interface CookFiltersPanelProps {
	specialties: string[];
	filters: CookFilters;
	onChange: (filters: CookFilters) => void;
	onClear: () => void;
	hasActiveFilters: boolean;
}

export function CookFiltersPanel({
	specialties,
	filters,
	onChange,
	onClear,
	hasActiveFilters,
}: CookFiltersPanelProps) {
	const toggleSpecialty = (specialty: string) => {
		onChange({
			...filters,
			specialties: filters.specialties.includes(specialty)
				? filters.specialties.filter((selected) => selected !== specialty)
				: [...filters.specialties, specialty],
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-base font-semibold">Filtros</h2>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={onClear}
						className="text-xs font-medium text-accent hover:text-accent/80"
					>
						Limpiar todo
					</button>
				)}
			</div>

			<div className="flex flex-col gap-3">
				<h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
					Especialidades
				</h3>
				<div className="flex flex-wrap gap-2">
					{specialties.map((specialty) => {
						const isSelected = filters.specialties.includes(specialty);
						return (
							<button
								key={specialty}
								type="button"
								onClick={() => toggleSpecialty(specialty)}
								className={cn(
									badgeVariants({
										variant: isSelected ? "default" : "outline",
									}),
									"h-7 cursor-pointer px-2.5 text-xs",
								)}
							>
								{specialty}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
