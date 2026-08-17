import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetAllCategoriesInfinite } from "@/entities/categories";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { useDebouncedValue } from "@/shared/hooks";
import {
	AdminListHeader,
	CategoryFormDialog,
	CategoryRow,
	CategoryRowSkeleton,
} from "./components";

export function AdminCategoriesPage() {
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
	} = useGetAllCategoriesInfinite(query);

	const categories = data?.pages.flatMap((page) => page.data);
	const activeCount = categories?.filter(
		(category) => category.isActive,
	).length;

	return (
		<div>
			<AdminListHeader
				title="Categorías"
				description={
					categories === undefined
						? "Cargando el listado de categorías..."
						: `${categories.length} categorías cargadas · ${activeCount} activas`
				}
				searchValue={query}
				onSearchChange={setQuery}
				searchPlaceholder="Buscar por nombre o descripción"
				searchAriaLabel="Buscar categorías"
				action={<CategoryFormDialog />}
			/>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar las categorías.
				</p>
			)}

			{isPending && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index}>
							{index > 0 && <Separator />}
							<CategoryRowSkeleton />
						</div>
					))}
				</div>
			)}

			{categories !== undefined && categories.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{categories.map((category, index) => (
						<div key={category.id}>
							{index > 0 && <Separator />}
							<CategoryRow category={category} />
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

			{categories !== undefined && categories.length === 0 && (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
					<div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
						<Tag className="size-5" />
					</div>
					<div>
						<p className="font-medium text-foreground">
							No se encontraron categorías
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{query
								? "Prueba con otro nombre o descripción."
								: "Aún no hay categorías registradas."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
