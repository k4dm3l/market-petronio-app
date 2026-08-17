import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface StatCardProps {
	icon: LucideIcon;
	label: string;
	value: string;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
	return (
		<div className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
			<div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 text-primary">
				<Icon className="size-5" />
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="text-3xl font-semibold tracking-tight">{value}</span>
				<span className="text-sm text-muted-foreground">{label}</span>
			</div>
		</div>
	);
}

export function StatCardSkeleton() {
	return (
		<div className="flex flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-5">
			<Skeleton className="size-11 rounded-xl" />
			<div className="flex flex-col gap-2">
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-4 w-32" />
			</div>
		</div>
	);
}
