import {
	MapPin,
	MoreVertical,
	Package,
	Plus,
	UserRoundCheck,
	UserRoundX,
} from "lucide-react";
import { Link } from "react-router";
import type { Cook } from "@/entities/cooks";
import { useSetCookActive } from "@/entities/cooks";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
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

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return (first + last).toUpperCase();
}

interface CookRowProps {
	cook: Cook;
}

export function CookRow({ cook }: CookRowProps) {
	const { mutate, isPending } = useSetCookActive();

	return (
		<div className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:gap-5 sm:px-6">
			<Avatar size="lg" className="shrink-0">
				<AvatarFallback className="bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 font-semibold text-primary">
					{getInitials(cook.displayName)}
				</AvatarFallback>
			</Avatar>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="truncate font-semibold text-foreground">
					{cook.displayName}
				</span>
				<span className="truncate text-sm text-muted-foreground">
					{cook.specialties.length > 0
						? cook.specialties.join(", ")
						: cook.contactWhatsApp || "Sin especialidades"}
				</span>
			</div>

			<div className="hidden w-52 shrink-0 flex-col gap-0.5 md:flex">
				<span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
					Ubicación
				</span>
				{cook.publicLocation ? (
					<span className="truncate text-sm text-foreground">
						{cook.publicLocation}
					</span>
				) : (
					<span className="flex items-center gap-1 text-sm text-muted-foreground/70">
						<MapPin className="size-3.5" />
						Sin registrar
					</span>
				)}
			</div>

			<Badge
				className={cn(
					"shrink-0 border",
					cook.isActive
						? "border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
						: "border-transparent bg-muted text-muted-foreground",
				)}
			>
				{cook.isActive ? "Activo" : "Inactivo"}
			</Badge>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={`Acciones para ${cook.displayName}`}
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
								mutate({
									id: cook.id,
									payload: { isActive: !cook.isActive },
								})
							}
						>
							{cook.isActive ? (
								<UserRoundX className="size-5" />
							) : (
								<UserRoundCheck className="size-5" />
							)}
							{cook.isActive ? "Desactivar cocinero" : "Activar cocinero"}
						</DropdownMenuItem>
						<DropdownMenuItem
							render={<Link to={`/admin/cooks/${cook.id}/products`} />}
						>
							<Package className="size-5" />
							Ver productos
						</DropdownMenuItem>
						<DropdownMenuItem
							render={<Link to={`/admin/cooks/${cook.id}/products/new`} />}
						>
							<Plus className="size-5" />
							Agregar producto
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function CookRowSkeleton() {
	return (
		<div className="flex items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
			<Skeleton className="size-10 shrink-0 rounded-full" />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-3 w-44" />
			</div>
			<Skeleton className="hidden h-8 w-40 md:block" />
			<Skeleton className="h-5 w-16 shrink-0 rounded-full" />
			<Skeleton className="size-8 shrink-0 rounded-lg" />
		</div>
	);
}
