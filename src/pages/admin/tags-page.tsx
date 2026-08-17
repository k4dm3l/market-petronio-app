import { Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetTagsInfinite } from "@/entities/tags";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { useDebouncedValue } from "@/shared/hooks";
import { AdminListHeader, TagFormDialog, TagRow, TagRowSkeleton } from "./components";

export function AdminTagsPage() {
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
	} = useGetTagsInfinite(query);

	const tags = data?.pages.flatMap((page) => page.data);

	return (
		<div>
			<AdminListHeader
				title="Etiquetas"
				description={
					tags === undefined
						? "Cargando el catálogo de etiquetas..."
						: `${tags.length} etiquetas cargadas`
				}
				searchValue={query}
				onSearchChange={setQuery}
				searchPlaceholder="Buscar por texto"
				searchAriaLabel="Buscar etiquetas"
				action={<TagFormDialog />}
			/>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar las etiquetas.
				</p>
			)}

			{isPending && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index}>
							{index > 0 && <Separator />}
							<TagRowSkeleton />
						</div>
					))}
				</div>
			)}

			{tags !== undefined && tags.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{tags.map((tag, index) => (
						<div key={tag.id}>
							{index > 0 && <Separator />}
							<TagRow tag={tag} />
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

			{tags !== undefined && tags.length === 0 && (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
					<div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
						<Hash className="size-5" />
					</div>
					<div>
						<p className="font-medium text-foreground">
							No se encontraron etiquetas
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{query
								? "Prueba con otro texto."
								: "Aún no hay etiquetas registradas."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
