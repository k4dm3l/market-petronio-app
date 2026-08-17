import { Tag } from "lucide-react";
import { useState } from "react";
import { useGetAllCategories } from "@/entities/categories";
import { Separator } from "@/shared/components/ui/separator";
import {
	AdminListHeader,
	CategoryFormDialog,
	CategoryRow,
	CategoryRowSkeleton,
} from "./components";

export function AdminCategoriesPage() {
	const [query, setQuery] = useState("");
	const { data, isPending, isError } = useGetAllCategories(query);

	const activeCount = data?.filter((category) => category.isActive).length;

	return (
		<div>
			<AdminListHeader
				title="Categorías"
				description={
					data === undefined
						? "Cargando el listado de categorías..."
						: `${data.length} categorías · ${activeCount} activas`
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

			{data !== undefined && data.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{data.map((category, index) => (
						<div key={category.id}>
							{index > 0 && <Separator />}
							<CategoryRow category={category} />
						</div>
					))}
				</div>
			)}

			{data !== undefined && data.length === 0 && (
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
