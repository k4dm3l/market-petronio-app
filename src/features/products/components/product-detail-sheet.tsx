import { UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useGetProduct } from "@/entities/products";
import { Badge } from "@/shared/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface ProductDetailSheetProps {
	productId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// Fetches the product fresh by id (GET /api/products/:id) rather than reusing
// whatever was already in the list/card, so the detail always reflects the
// current record.
export function ProductDetailSheet({
	productId,
	open,
	onOpenChange,
}: ProductDetailSheetProps) {
	const [activeImage, setActiveImage] = useState(0);
	const { data: product, isPending, isError } = useGetProduct(productId ?? "");

	return (
		<Sheet
			open={open}
			onOpenChange={(nextOpen) => {
				onOpenChange(nextOpen);
				if (!nextOpen) setActiveImage(0);
			}}
		>
			<SheetContent
				side="right"
				className="w-full max-w-md gap-0 overflow-y-auto p-0"
			>
				<SheetHeader className="border-b border-border">
					<SheetTitle>{product?.name ?? "Detalle del producto"}</SheetTitle>
				</SheetHeader>

				{isPending && (
					<div className="flex flex-col gap-4 p-4">
						<Skeleton className="aspect-square w-full rounded-2xl" />
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				)}

				{isError && (
					<p className="p-4 text-sm text-destructive">
						No se pudo cargar el producto.
					</p>
				)}

				{product && (
					<div className="flex flex-col gap-4 p-4">
						<div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted">
							{product.images.length > 0 ? (
								<img
									src={
										product.images[activeImage]?.url ?? product.images[0].url
									}
									alt={product.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
									<UtensilsCrossed className="size-12 text-primary/40" />
								</div>
							)}
						</div>

						{product.images.length > 1 && (
							<div className="flex gap-2 overflow-x-auto pb-1">
								{product.images.map((image, index) => (
									<button
										key={image.id}
										type="button"
										onClick={() => setActiveImage(index)}
										className={cn(
											"size-14 shrink-0 overflow-hidden rounded-lg border-2",
											index === activeImage
												? "border-primary"
												: "border-transparent",
										)}
									>
										<img
											src={image.url}
											alt=""
											className="h-full w-full object-cover"
										/>
									</button>
								))}
							</div>
						)}

						<div className="flex items-center justify-between gap-2">
							<span className="text-2xl font-bold text-foreground">
								{formatCurrency(product.price)}
							</span>
							<Badge
								className={cn(
									"shrink-0 border",
									product.isAvailable
										? "border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
										: "border-transparent bg-muted text-muted-foreground",
								)}
							>
								{product.isAvailable ? "Disponible" : "No disponible"}
							</Badge>
						</div>

						{product.description && (
							<p className="text-sm text-muted-foreground">
								{product.description}
							</p>
						)}

						<div className="flex flex-col gap-1 rounded-xl border border-border p-3 text-sm">
							{product.availability === "available" ? (
								<span className="text-foreground">
									{product.stock !== undefined
										? `${product.stock} unidades disponibles`
										: "Disponible"}
								</span>
							) : (
								<>
									<span className="text-foreground">Producto por encargo</span>
									{product.minimumOrderQuantity !== undefined && (
										<span className="text-muted-foreground">
											Pedido mínimo: {product.minimumOrderQuantity} unidades
										</span>
									)}
									{product.preparationTimeHours !== undefined && (
										<span className="text-muted-foreground">
											Tiempo de preparación: {product.preparationTimeHours}{" "}
											horas
										</span>
									)}
								</>
							)}
						</div>

						{product.tags.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								{product.tags.map((tag) => (
									<Badge
										key={tag}
										variant="outline"
										className="h-7 px-2.5 text-xs"
									>
										{tag}
									</Badge>
								))}
							</div>
						)}
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
