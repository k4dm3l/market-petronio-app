import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/shared/components/ui/input";

interface AdminListHeaderProps {
	title: string;
	description?: ReactNode;
	searchValue: string;
	onSearchChange: (value: string) => void;
	searchPlaceholder: string;
	searchAriaLabel: string;
	action?: ReactNode;
}

// Sticks to the top of the admin `<main>` scroll container (see
// admin-layout.tsx) so title + search stay visible while a list scrolls
// underneath, on both mobile and desktop.
export function AdminListHeader({
	title,
	description,
	searchValue,
	onSearchChange,
	searchPlaceholder,
	searchAriaLabel,
	action,
}: AdminListHeaderProps) {
	return (
		<div className="sticky top-0 z-10 flex flex-col gap-6 bg-background pt-4 pb-6">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-4xl font-semibold">{title}</h1>
					{description && (
						<p className="mt-2 text-sm text-muted-foreground">{description}</p>
					)}
				</div>
				{action}
			</div>

			<div className="relative w-full sm:w-1/2">
				<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={searchValue}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder={searchPlaceholder}
					className="pl-9"
					aria-label={searchAriaLabel}
				/>
			</div>
		</div>
	);
}
