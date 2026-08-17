import { Hash } from "lucide-react";
import type { TagResponseDto } from "@/entities/tags";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatDate } from "@/shared/lib/format";

interface TagRowProps {
	tag: TagResponseDto;
}

export function TagRow({ tag }: TagRowProps) {
	return (
		<div className="flex items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
			<Avatar size="lg" className="shrink-0 rounded-xl after:rounded-xl">
				<AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 text-primary">
					<Hash className="size-4" />
				</AvatarFallback>
			</Avatar>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="truncate font-semibold text-foreground">
					{tag.text}
				</span>
				{tag.createdAt && (
					<span className="truncate text-sm text-muted-foreground">
						Creada el {formatDate(tag.createdAt)}
					</span>
				)}
			</div>
		</div>
	);
}

export function TagRowSkeleton() {
	return (
		<div className="flex items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
			<Skeleton className="size-10 shrink-0 rounded-xl" />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-3 w-44" />
			</div>
		</div>
	);
}
