import { Package, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useGetProducts, useUpdateProduct } from "@/entities/products";
import { useAuth } from "@/entities/session";
import { ProductRow, ProductRowSkeleton } from "@/features/products";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";

function normalize(value: string) {
	return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function CookProductsPage() {
	const [query, setQuery] = useState("");
	const { cook } = useAuth();
	const updateProduct = useUpdateProduct();

	const cookId = cook?.id;
	const {
		data: products,
		isPending: isProductsPending,
		isError,
	} = useGetProducts({ cookId, limit: 100 }, { enabled: Boolean(cookId) });

	const isPending = Boolean(cookId) && isProductsPending;

	const filtered = useMemo(() => {
		const list = products ?? [];
		const q = normalize(query.trim());
		if (!q) return list;
		return list.filter((product) =>
			[product.name, product.description, ...product.tags]
				.filter((value): value is string => Boolean(value))
				.some((value) => normalize(value).includes(q)),
		);
	}, [products, query]);

	return (
		<div>
			<div className="mb-6 flex items-center justify-between gap-3">
				<div>
					<h1 className="text-4xl font-semibold">Mis productos</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{isPending
							? "Cargando tus productos..."
							: `${filtered.length} productos`}
					</p>
				</div>
				{cookId && (
					<Button type="button" render={<Link to="/products/new" />}>
						<Plus className="size-4" />
						Producto
					</Button>
				)}
			</div>

			<div className="relative mb-6">
				<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Buscar por nombre, descripción o etiqueta"
					className="w-full pl-9"
					aria-label="Buscar productos"
				/>
			</div>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar tus productos.
				</p>
			)}

			{isPending && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{Array.from({ length: 3 }).map((_, index) => (
						<div key={index}>
							{index > 0 && <Separator />}
							<ProductRowSkeleton />
						</div>
					))}
				</div>
			)}

			{!isPending && !isError && !cook && (
				<p className="text-sm text-muted-foreground">
					No encontramos tu perfil de cocinero.
				</p>
			)}

			{!isPending && filtered.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{filtered.map((product, index) => (
						<div key={product.id}>
							{index > 0 && <Separator />}
							<ProductRow
								product={product}
								editHref={`/products/${product.id}/edit`}
								statusLabel={product.isAvailable ? "Disponible" : "Oculto"}
								isStatusOn={product.isAvailable}
								toggleLabel={
									product.isAvailable ? "Ocultar producto" : "Publicar producto"
								}
								isBusy={updateProduct.isPending}
								onToggleStatus={() =>
									updateProduct.mutate({
										id: product.id,
										payload: { isAvailable: !product.isAvailable },
									})
								}
							/>
						</div>
					))}
				</div>
			)}

			{!isPending && !isError && cook && filtered.length === 0 && (
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
								: "Todavía no tienes productos registrados."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
