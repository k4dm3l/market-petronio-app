import { Package } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAllCooks } from "@/entities/cooks";
import { useGetAllProducts } from "@/entities/products";
import { Separator } from "@/shared/components/ui/separator";
import {
	AdminListHeader,
	ProductRow,
	ProductRowSkeleton,
} from "./components";

function normalize(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "");
}

export function AdminProductsPage() {
	const { data, isPending, isError } = useGetAllProducts();
	const { data: cooks } = useGetAllCooks();
	const [query, setQuery] = useState("");

	const cookNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const cook of cooks ?? []) map.set(cook.id, cook.displayName);
		return map;
	}, [cooks]);

	const filtered = useMemo(() => {
		if (!data) return [];
		const q = normalize(query.trim());
		if (!q) return data;
		return data.filter((product) =>
			[product.name, product.description, ...product.tags]
				.filter((value): value is string => Boolean(value))
				.some((value) => normalize(value).includes(q)),
		);
	}, [data, query]);

	const activeCount = data?.filter((product) => product.isActive).length;

	return (
		<div>
			<AdminListHeader
				title="Productos"
				description={
					data === undefined
						? "Cargando el listado de productos..."
						: `${data.length} productos · ${activeCount} activos`
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

			{data !== undefined && filtered.length > 0 && (
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

			{data !== undefined && filtered.length === 0 && (
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
