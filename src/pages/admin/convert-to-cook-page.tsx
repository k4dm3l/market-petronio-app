import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useGetCustomers } from "@/entities/users";
import { ConvertToCookForm } from "./components/convert-to-cook-form";

export function AdminConvertToCookPage() {
	const { id = "" } = useParams();
	const navigate = useNavigate();
	const { data: customers, isPending, isError } = useGetCustomers();
	const customer = customers?.find((c) => c.id === id);

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/admin/customers"
				className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Volver a clientes
			</Link>

			{isPending && (
				<p className="text-sm text-muted-foreground">Cargando cliente...</p>
			)}

			{isError && (
				<p className="text-sm text-destructive">No se pudo cargar el cliente.</p>
			)}

			{!isPending && !isError && !customer && (
				<p className="text-sm text-muted-foreground">
					Cliente no encontrado.{" "}
					<Link to="/admin/customers" className="underline">
						Volver a clientes
					</Link>
				</p>
			)}

			{customer && (
				<>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Convertir en cocinero
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							{customer.name} · {customer.email}
						</p>
					</div>

					<ConvertToCookForm
						userId={customer.id}
						onSuccess={() => navigate("/admin/customers")}
					/>
				</>
			)}
		</div>
	);
}
