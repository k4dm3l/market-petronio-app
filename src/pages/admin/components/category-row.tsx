import { EyeOff, MoreVertical, Tag } from "lucide-react";
import type { Category } from "@/entities/categories";
import { useSetCategoryActive } from "@/entities/categories";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface CategoryRowProps {
	category: Category;
}

export function CategoryRow({ category }: CategoryRowProps) {
	const { mutate, isPending } = useSetCategoryActive();

	return (
		<div className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:gap-5 sm:px-6">
			<Avatar size="lg" className="shrink-0 rounded-xl after:rounded-xl">
				{category.image && (
					<AvatarImage src={category.image} alt={category.name} />
				)}
				<AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 text-primary">
					<Tag className="size-4" />
				</AvatarFallback>
			</Avatar>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="truncate font-semibold text-foreground">
					{category.name}
				</span>
				<span className="truncate text-sm text-muted-foreground">
					{category.description || "Sin descripción"}
				</span>
			</div>

			<Badge
				className={cn(
					"shrink-0 border",
					category.isActive
						? "border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
						: "border-transparent bg-muted text-muted-foreground",
				)}
			>
				{category.isActive ? "Activa" : "Inactiva"}
			</Badge>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={`Acciones para ${category.name}`}
							disabled={isPending}
						/>
					}
				>
					<MoreVertical className="size-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() =>
								mutate({ id: category.id, isActive: !category.isActive })
							}
						>
							{category.isActive ? (
								<EyeOff className="size-5" />
							) : (
								<Tag className="size-5" />
							)}
							{category.isActive ? "Desactivar categoría" : "Activar categoría"}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function CategoryRowSkeleton() {
	return (
		<div className="flex items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
			<Skeleton className="size-10 shrink-0 rounded-xl" />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-3 w-44" />
			</div>
			<Skeleton className="h-5 w-16 shrink-0 rounded-full" />
			<Skeleton className="size-8 shrink-0 rounded-lg" />
		</div>
	);
}
