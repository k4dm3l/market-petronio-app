import { Heart, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { useCart } from "@/entities/cart";
import type { Product } from "@/entities/products";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart();
	const [isFavorite, setIsFavorite] = useState(false);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const hasImages = product.images.length > 0;
	const isMadeToOrder = product.availability === "made_to_order";

	return (
		<article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
			<div className="relative aspect-square overflow-hidden bg-muted">
				<button
					type="button"
					onClick={() => hasImages && setIsLightboxOpen(true)}
					disabled={!hasImages}
					aria-label={hasImages ? `Ver imágenes de ${product.name}` : undefined}
					className="block h-full w-full cursor-zoom-in disabled:cursor-default"
				>
					{hasImages ? (
						<img
							src={product.images[0].url}
							alt={product.name}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
							<UtensilsCrossed className="size-10 text-primary/40" />
						</div>
					)}
				</button>

				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onClick={() => setIsFavorite((prev) => !prev)}
					aria-pressed={isFavorite}
					aria-label={
						isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
					}
					className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
				>
					<Heart
						className={cn(
							"size-4",
							isFavorite ? "fill-primary text-primary" : "text-foreground",
						)}
					/>
				</Button>

				{isMadeToOrder && (
					<Badge
						variant="secondary"
						className="absolute bottom-2 left-2 bg-background/90 text-foreground backdrop-blur-sm"
					>
						Por encargo
					</Badge>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-1.5 p-3">
				<h3 className="line-clamp-1 text-base font-semibold">{product.name}</h3>
				{product.description && (
					<p className="line-clamp-2 text-sm text-muted-foreground">
						{product.description}
					</p>
				)}

				{product.tags.length > 0 && (
					<div className="mt-1 flex flex-wrap gap-1">
						{product.tags.slice(0, 2).map((tag) => (
							<Badge key={tag} variant="outline" className="h-7 px-2.5 text-xs">
								{tag}
							</Badge>
						))}
					</div>
				)}

				<div className="mt-auto flex items-center justify-between pt-2">
					<span className="text-base font-bold text-foreground">
						{formatCurrency(product.price)}
					</span>
					<Button
						type="button"
						size="sm"
						className="h-8"
						disabled={!product.isAvailable}
						onClick={() => addItem(product)}
					>
						{product.isAvailable ? "Agregar" : "No disponible"}
					</Button>
				</div>
			</div>

			{hasImages && (
				<Lightbox
					open={isLightboxOpen}
					close={() => setIsLightboxOpen(false)}
					slides={product.images.map((image) => ({
						src: image.url,
						alt: product.name,
					}))}
				/>
			)}
		</article>
	);
}
