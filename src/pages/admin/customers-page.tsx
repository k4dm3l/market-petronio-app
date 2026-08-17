import { UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetCustomersInfinite } from "@/entities/users";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { useDebouncedValue } from "@/shared/hooks";
import {
	AdminListHeader,
	CustomerRow,
	CustomerRowSkeleton,
} from "./components";

export function AdminCustomersPage() {
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
	} = useGetCustomersInfinite(query);

	const customers = data?.pages.flatMap((page) => page.data);
	const activeCount = customers?.filter((customer) => customer.isActive).length;

	return (
		<div>
			<AdminListHeader
				title="Clientes"
				description={
					customers === undefined
						? "Cargando el listado de clientes registrados..."
						: `${customers.length} clientes cargados · ${activeCount} activos`
				}
				searchValue={query}
				onSearchChange={setQuery}
				searchPlaceholder="Buscar por nombre, correo o dirección"
				searchAriaLabel="Buscar clientes"
			/>

			{isError && (
				<p className="text-sm text-destructive">
					No se pudieron cargar los clientes.
				</p>
			)}

			{isPending && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index}>
							{index > 0 && <Separator />}
							<CustomerRowSkeleton />
						</div>
					))}
				</div>
			)}

			{customers !== undefined && customers.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{customers.map((customer, index) => (
						<div key={customer.id}>
							{index > 0 && <Separator />}
							<CustomerRow customer={customer} />
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

			{customers !== undefined && customers.length === 0 && (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
					<div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
						<UsersRound className="size-5" />
					</div>
					<div>
						<p className="font-medium text-foreground">
							No se encontraron clientes
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{query
								? "Prueba con otro nombre, correo o dirección."
								: "Aún no hay clientes registrados."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
