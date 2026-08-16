import type { Category } from "@/entities/categories";
import { badgeVariants } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import type { ProductFilters } from "../filters";

interface FiltersPanelProps {
	categories: Category[];
	tags: string[];
	filters: ProductFilters;
	onChange: (filters: ProductFilters) => void;
	onClear: () => void;
	hasActiveFilters: boolean;
}

export function FiltersPanel({
	categories,
	tags,
	filters,
	onChange,
	onClear,
	hasActiveFilters,
}: FiltersPanelProps) {
	const toggleCategory = (id: string) => {
		onChange({
			...filters,
			categoryIds: filters.categoryIds.includes(id)
				? filters.categoryIds.filter((categoryId) => categoryId !== id)
				: [...filters.categoryIds, id],
		});
	};

	const toggleTag = (tag: string) => {
		onChange({
			...filters,
			tags: filters.tags.includes(tag)
				? filters.tags.filter((selected) => selected !== tag)
				: [...filters.tags, tag],
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
					Categorías
				</h3>
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => {
						const isSelected = filters.categoryIds.includes(category.id);
						return (
							<button
								key={category.id}
								type="button"
								onClick={() => toggleCategory(category.id)}
								className={cn(
									badgeVariants({
										variant: isSelected ? "default" : "outline",
									}),
									"h-7 cursor-pointer px-2.5 text-xs",
								)}
							>
								{category.name}
							</button>
						);
					})}
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-3">
				<h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
					Tags
				</h3>
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => {
						const isSelected = filters.tags.includes(tag);
						return (
							<button
								key={tag}
								type="button"
								onClick={() => toggleTag(tag)}
								className={cn(
									badgeVariants({
										variant: isSelected ? "default" : "outline",
									}),
									"h-7 cursor-pointer px-2.5 text-xs",
								)}
							>
								{tag}
							</button>
						);
					})}
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-3">
				<h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
					Rango de precio
				</h3>
				<div className="flex items-center gap-2">
					<Input
						type="number"
						inputMode="numeric"
						min={0}
						placeholder="Mín"
						value={filters.minPrice}
						onChange={(event) =>
							onChange({ ...filters, minPrice: event.target.value })
						}
					/>
					<span className="text-muted-foreground">–</span>
					<Input
						type="number"
						inputMode="numeric"
						min={0}
						placeholder="Máx"
						value={filters.maxPrice}
						onChange={(event) =>
							onChange({ ...filters, maxPrice: event.target.value })
						}
					/>
				</div>
			</div>
		</div>
	);
}
