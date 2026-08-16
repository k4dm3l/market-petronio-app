import { UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetCustomers } from "@/entities/users";
import { Separator } from "@/shared/components/ui/separator";
import {
	AdminListHeader,
	CustomerRow,
	CustomerRowSkeleton,
} from "./components";

function normalize(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "");
}

export function AdminCustomersPage() {
	const { data, isPending, isError } = useGetCustomers();
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		if (!data) return [];
		const q = normalize(query.trim());
		if (!q) return data;
		return data.filter((customer) =>
			[customer.name, customer.email, customer.deliveryInformation?.address]
				.filter((value): value is string => Boolean(value))
				.some((value) => normalize(value).includes(q)),
		);
	}, [data, query]);

	const activeCount = data?.filter((customer) => customer.isActive).length;

	return (
		<div>
			<AdminListHeader
				title="Clientes"
				description={
					data === undefined
						? "Cargando el listado de clientes registrados..."
						: `${data.length} clientes registrados · ${activeCount} activos`
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

			{data !== undefined && filtered.length > 0 && (
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					{filtered.map((customer, index) => (
						<div key={customer.id}>
							{index > 0 && <Separator />}
							<CustomerRow customer={customer} />
						</div>
					))}
				</div>
			)}

			{data !== undefined && filtered.length === 0 && (
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
