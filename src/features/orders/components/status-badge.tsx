import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

export interface StatusMeta {
	label: string;
	className: string;
}

interface StatusBadgeProps<T extends string> {
	status: T;
	meta: Record<T, StatusMeta>;
}

export function StatusBadge<T extends string>({
	status,
	meta,
}: StatusBadgeProps<T>) {
	const { label, className } = meta[status];
	return <Badge className={cn("shrink-0 border", className)}>{label}</Badge>;
}
