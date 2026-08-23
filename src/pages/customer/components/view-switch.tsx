import { Link, useLocation } from "react-router";
import { cn } from "@/shared/lib/utils";

const VIEWS = [
	{ to: "/search", label: "Productos" },
	{ to: "/search/cooks", label: "Cocineras" },
] as const;

export function ViewSwitch() {
	const { pathname } = useLocation();

	return (
		<div className="inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
			{VIEWS.map((view) => {
				const isActive = pathname === view.to;
				return (
					<Link
						key={view.to}
						to={view.to}
						className={cn(
							"rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
							isActive
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{view.label}
					</Link>
				);
			})}
		</div>
	);
}
