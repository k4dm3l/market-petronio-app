import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";

interface FiltersSheetProps {
	activeCount: number;
	/** The filters panel for the current view (products or cooks). */
	children: ReactNode;
}

export function FiltersSheet({ activeCount, children }: FiltersSheetProps) {
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
				<div className="mt-4">{children}</div>
			</SheetContent>
		</Sheet>
	);
}
