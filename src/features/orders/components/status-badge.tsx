import type { ComponentType } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

export interface StatusMeta {
	label: string;
	className: string;
}

interface StatusBadgeProps<T extends string> {
	status: T;
	meta: Record<T, StatusMeta>;
	// Fixed per badge category (payment/order/shipping) — lets the user tell
	// which axis a badge refers to even when two categories share a label
	// like "Pendiente".
	icon: ComponentType<{ className?: string; "data-icon"?: string }>;
}

export function StatusBadge<T extends string>({
	status,
	meta,
	icon: Icon,
}: StatusBadgeProps<T>) {
	// Falls back instead of crashing when the backend sends a status value
	// this build doesn't know about yet (new status added server-side, or a
	// typing mismatch) — shows the raw value rather than taking the page down.
	const { label, className } = meta[status] ?? {
		label: status,
		className: "border-transparent bg-muted text-muted-foreground",
	};
	return (
		<Badge className={cn("shrink-0 border", className)}>
			<Icon data-icon="inline-start" className="size-3" />
			{label}
		</Badge>
	);
}
