import {
	MoreVertical,
	Package,
	PackageCheck,
	PackageX,
	Pencil,
} from "lucide-react";
import { Link } from "react-router";
import type { Product } from "@/entities/products";
import { useSetProductActive } from "@/entities/products";
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
import { formatCurrency } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface ProductRowProps {
	product: Product;
	cookName?: string;
}

export function ProductRow({ product, cookName }: ProductRowProps) {
	const { mutate, isPending } = useSetProductActive();
	const image = product.images[0]?.url;

	return (
		<div className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:gap-5 sm:px-6">
			<Avatar size="lg" className="shrink-0 rounded-xl after:rounded-xl">
				{image && <AvatarImage src={image} alt={product.name} />}
				<AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 text-primary">
					<Package className="size-4" />
				</AvatarFallback>
			</Avatar>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="truncate font-semibold text-foreground">
					{product.name}
				</span>
				<span className="truncate text-sm text-muted-foreground">
					{formatCurrency(product.price)}
				</span>
			</div>

			<div className="hidden w-52 shrink-0 flex-col gap-0.5 md:flex">
				<span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
					Disponibilidad
				</span>
				<span className="truncate text-sm text-foreground">
					{product.availability === "available"
						? `Disponible${product.stock !== undefined ? ` · ${product.stock} und.` : ""}`
						: "Bajo pedido"}
				</span>
			</div>

			{cookName && (
				<div className="hidden w-40 shrink-0 flex-col gap-0.5 md:flex">
					<span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
						Cocinero
					</span>
					<span className="truncate text-sm text-foreground">{cookName}</span>
				</div>
			)}

			<Badge
				className={cn(
					"shrink-0 border",
					product.isActive
						? "border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
						: "border-transparent bg-muted text-muted-foreground",
				)}
			>
				{product.isActive ? "Activo" : "Inactivo"}
			</Badge>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={`Acciones para ${product.name}`}
							disabled={isPending}
						/>
					}
				>
					<MoreVertical className="size-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem
							render={
								<Link
									to={`/admin/cooks/${product.cookId}/products/${product.id}/edit`}
								/>
							}
						>
							<Pencil className="size-5" />
							Editar producto
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								mutate({
									id: product.id,
									payload: { isActive: !product.isActive },
								})
							}
						>
							{product.isActive ? (
								<PackageX className="size-5" />
							) : (
								<PackageCheck className="size-5" />
							)}
							{product.isActive ? "Desactivar producto" : "Activar producto"}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function ProductRowSkeleton() {
	return (
		<div className="flex items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
			<Skeleton className="size-10 shrink-0 rounded-xl" />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-3 w-24" />
			</div>
			<Skeleton className="hidden h-8 w-40 md:block" />
			<Skeleton className="h-5 w-16 shrink-0 rounded-full" />
			<Skeleton className="size-8 shrink-0 rounded-lg" />
		</div>
	);
}
