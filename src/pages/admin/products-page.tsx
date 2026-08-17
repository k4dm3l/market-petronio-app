import { Package } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAllCooks } from "@/entities/cooks";
import { useGetAllProductsInfinite } from "@/entities/products";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { AdminListHeader, ProductRow, ProductRowSkeleton } from "./components";

function normalize(value: string) {
	return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function AdminProductsPage() {
	// Purely client-side filtering (no `search` param on /api/admin/products),
	// so this stays local state rather than syncing to the URL.
	const [query, setQuery] = useState("");

	const {
		data,
		isPending,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetAllProductsInfinite();
	const { data: cooks } = useGetAllCooks();

	const products = data?.pages.flatMap((page) => page.data);

	const cookNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const cook of cooks ?? []) map.set(cook.id, cook.displayName);
		return map;
	}, [cooks]);

	// /api/admin/products has no `search` param — filters client-side over
	// whatever pages have been loaded so far.
	const filtered = useMemo(() => {
		if (!products) return [];
		const q = normalize(query.trim());
		if (!q) return products;
		return products.filter((product) =>
			[product.name, product.description, ...product.tags]
				.filter((value): value is string => Boolean(value))
				.some((value) => normalize(value).includes(q)),
		);
	}, [products, query]);

	const activeCount = products?.filter((product) => product.isActive).length;

	return (
		<div>
			<AdminListHeader
				title="Productos"
				description={
					products === undefined
						? "Cargando el listado de productos..."
						: `${products.length} productos cargados · ${activeCount} activos`
				}
				searchValue={query}
				onSearchChange={setQuery}
				searchPlaceholder="Buscar por nombre, descripción o etiqueta"
				searchAriaLabel="Buscar productos"
			/>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar los productos.
				</p>
			)}

			{isPending && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index}>
							{index > 0 && <Separator />}
							<ProductRowSkeleton />
						</div>
					))}
				</div>
			)}

			{products !== undefined && filtered.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{filtered.map((product, index) => (
						<div key={product.id}>
							{index > 0 && <Separator />}
							<ProductRow
								product={product}
								cookName={cookNameById.get(product.cookId)}
							/>
						</div>
					))}
				</div>
			)}

			{hasNextPage && (
				<div className="mt-6 flex justify-center">
					<Button
						type="button"
						variant="outline"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<>
								<Spinner className="size-4" />
								Cargando...
							</>
						) : (
							"Cargar más"
						)}
					</Button>
				</div>
			)}

			{products !== undefined && filtered.length === 0 && (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
					<div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
						<Package className="size-5" />
					</div>
					<div>
						<p className="font-medium text-foreground">
							No se encontraron productos
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{query
								? "Prueba con otro nombre, descripción o etiqueta."
								: "Aún no hay productos registrados."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
