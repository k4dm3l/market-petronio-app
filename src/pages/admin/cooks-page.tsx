import { ChefHat } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAllCooks } from "@/entities/cooks";
import { Separator } from "@/shared/components/ui/separator";
import { AdminListHeader, CookRow, CookRowSkeleton } from "./components";

function normalize(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "");
}

export function AdminCooksPage() {
	const { data, isPending, isError } = useGetAllCooks();
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		if (!data) return [];
		const q = normalize(query.trim());
		if (!q) return data;
		return data.filter((cook) =>
			[cook.displayName, cook.publicLocation, ...cook.specialties]
				.filter((value): value is string => Boolean(value))
				.some((value) => normalize(value).includes(q)),
		);
	}, [data, query]);

	const activeCount = data?.filter((cook) => cook.isActive).length;

	return (
		<div>
			<AdminListHeader
				title="Cocineros"
				description={
					data === undefined
						? "Cargando el listado de cocineros..."
						: `${data.length} cocineros registrados · ${activeCount} activos`
				}
				searchValue={query}
				onSearchChange={setQuery}
				searchPlaceholder="Buscar por nombre, ubicación o especialidad"
				searchAriaLabel="Buscar cocineros"
			/>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar los cocineros.
				</p>
			)}

			{isPending && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index}>
							{index > 0 && <Separator />}
							<CookRowSkeleton />
						</div>
					))}
				</div>
			)}

			{data !== undefined && filtered.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{filtered.map((cook, index) => (
						<div key={cook.id}>
							{index > 0 && <Separator />}
							<CookRow cook={cook} />
						</div>
					))}
				</div>
			)}

			{data !== undefined && filtered.length === 0 && (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
					<div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
						<ChefHat className="size-5" />
					</div>
					<div>
						<p className="font-medium text-foreground">
							No se encontraron cocineros
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{query
								? "Prueba con otro nombre, ubicación o especialidad."
								: "Aún no hay cocineros registrados."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
