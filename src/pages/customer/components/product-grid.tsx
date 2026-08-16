import type { Product } from "@/entities/products";
import { ProductCard } from "@/features/products";

interface ProductGridProps {
	products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
	if (products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border py-16 text-center">
				<p className="text-sm font-medium">No encontramos productos</p>
				<p className="text-sm text-muted-foreground">
					Prueba ajustando los filtros o busca algo distinto.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
