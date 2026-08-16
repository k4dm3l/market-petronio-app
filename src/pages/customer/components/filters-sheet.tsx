import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@/entities/categories";
import { Button } from "@/shared/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import type { ProductFilters } from "../filters";
import { FiltersPanel } from "./filters-panel";

interface FiltersSheetProps {
	categories: Category[];
	tags: string[];
	filters: ProductFilters;
	onChange: (filters: ProductFilters) => void;
	onClear: () => void;
	hasActiveFilters: boolean;
	activeCount: number;
}

export function FiltersSheet({
	activeCount,
	...panelProps
}: FiltersSheetProps) {
	return (
		<Sheet>
			<SheetTrigger
				render={
					<Button type="button" variant="outline" className="lg:hidden">
						<SlidersHorizontal className="size-4" />
						Filtros
						{activeCount > 0 && (
							<span className="flex size-4 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
								{activeCount}
							</span>
						)}
					</Button>
				}
			/>
			<SheetContent side="left" className="w-full max-w-xs overflow-y-auto p-4">
				<SheetHeader className="p-0">
					<SheetTitle>Filtros</SheetTitle>
				</SheetHeader>
				<div className="mt-4">
					<FiltersPanel {...panelProps} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
