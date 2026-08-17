import { ChefHat } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetAllCooksInfinite } from "@/entities/cooks";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { useDebouncedValue } from "@/shared/hooks";
import { AdminListHeader, CookRow, CookRowSkeleton } from "./components";

export function AdminCooksPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") ?? "");
	const debouncedQuery = useDebouncedValue(query, 400);

	// Only pushes to the URL once the user stops typing, so every keystroke
	// doesn't spam a browser history / query-string update.
	useEffect(() => {
		setSearchParams(
			(prev) => {
				const params = new URLSearchParams(prev);
				if (debouncedQuery) params.set("q", debouncedQuery);
				else params.delete("q");
				return params;
			},
			{ replace: true },
		);
	}, [debouncedQuery, setSearchParams]);

	const {
		data,
		isPending,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetAllCooksInfinite(query);

	const cooks = data?.pages.flatMap((page) => page.data);
	const activeCount = cooks?.filter((cook) => cook.isActive).length;

	return (
		<div>
			<AdminListHeader
				title="Cocineros"
				description={
					cooks === undefined
						? "Cargando el listado de cocineros..."
						: `${cooks.length} cocineros cargados · ${activeCount} activos`
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

			{cooks !== undefined && cooks.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{cooks.map((cook, index) => (
						<div key={cook.id}>
							{index > 0 && <Separator />}
							<CookRow cook={cook} />
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

			{cooks !== undefined && cooks.length === 0 && (
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
