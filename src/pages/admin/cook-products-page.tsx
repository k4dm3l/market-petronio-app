import { ArrowLeft, Package, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useGetAllCooks } from "@/entities/cooks";
import {
	useGetAllProductsInfinite,
	useSetProductActive,
} from "@/entities/products";
import { ProductRow, ProductRowSkeleton } from "@/features/products";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { AdminListHeader } from "./components";

function normalize(value: string) {
	return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function AdminCookProductsPage() {
	const { id = "" } = useParams();
	// Purely client-side filtering (no `search` param on /api/admin/products),
	// so this stays local state rather than syncing to the URL.
	const [query, setQuery] = useState("");

	const {
		data: cooks,
		isPending: isCooksPending,
		isError: isCooksError,
	} = useGetAllCooks();
	const {
		data,
		isPending: isProductsPending,
		isError: isProductsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetAllProductsInfinite();
	const setProductActive = useSetProductActive();

	const cook = cooks?.find((c) => c.id === id);
	const products = data?.pages.flatMap((page) => page.data);
	const isPending = isCooksPending || isProductsPending;
	const isError = isCooksError || isProductsError;

	// /api/admin/products has no `search`/`cookId` params — filters
	// client-side over whatever pages have been loaded so far.
	const filtered = useMemo(() => {
		if (!products || !cook) return [];
		const cookProducts = products.filter(
			(product) => product.cookId === cook.id,
		);
		const q = normalize(query.trim());
		if (!q) return cookProducts;
		return cookProducts.filter((product) =>
			[product.name, product.description, ...product.tags]
				.filter((value): value is string => Boolean(value))
				.some((value) => normalize(value).includes(q)),
		);
	}, [products, cook, query]);

	return (
		<div>
			<div className="mb-6 flex items-center justify-between gap-3">
				<Link
					to="/admin/cooks"
					className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Volver a cocineros
				</Link>

				{cook && (
					<Button
						type="button"
						render={<Link to={`/admin/cooks/${cook.id}/products/new`} />}
					>
						<Plus className="size-4" />
						Producto
					</Button>
				)}
			</div>

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

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar los productos.
				</p>
			)}

			{!isPending && !isError && !cook && (
				<p className="text-sm text-muted-foreground">
					Cocinero no encontrado.{" "}
					<Link to="/admin/cooks" className="underline">
						Volver a cocineros
					</Link>
				</p>
			)}

			{cook && (
				<>
					<AdminListHeader
						title={`Productos de ${cook.displayName}`}
						description={
							products === undefined
								? "Cargando el listado de productos..."
								: `${filtered.length} productos`
						}
						searchValue={query}
						onSearchChange={setQuery}
						searchPlaceholder="Buscar por nombre, descripción o etiqueta"
						searchAriaLabel="Buscar productos"
					/>

					{filtered.length > 0 && (
						<div className="overflow-hidden rounded-2xl border border-border bg-card">
							{filtered.map((product, index) => (
								<div key={product.id}>
									{index > 0 && <Separator />}
									<ProductRow
										product={product}
										editHref={`/admin/cooks/${product.cookId}/products/${product.id}/edit`}
										statusLabel={product.isActive ? "Activo" : "Inactivo"}
										isStatusOn={product.isActive}
										toggleLabel={
											product.isActive
												? "Desactivar producto"
												: "Activar producto"
										}
										isBusy={setProductActive.isPending}
										onToggleStatus={() =>
											setProductActive.mutate({
												id: product.id,
												payload: { isActive: !product.isActive },
											})
										}
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

					{filtered.length === 0 && (
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
										: "Este cocinero todavía no tiene productos registrados."}
								</p>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
