import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useGetAllCooks } from "@/entities/cooks";
import { ProductForm } from "./components/product-form";

export function AdminCreateProductPage() {
	const { id = "" } = useParams();
	const navigate = useNavigate();
	const { data: cooks, isPending, isError } = useGetAllCooks();
	const cook = cooks?.find((c) => c.id === id);

	return (
		<div className="flex flex-col gap-6">
			<Link
				to={`/admin/cooks/${id}/products`}
				className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Volver a productos
			</Link>

			{isPending && (
				<p className="text-sm text-muted-foreground">Cargando cocinero...</p>
			)}

			{isError && (
				<p className="text-sm text-destructive">
					No se pudo cargar el cocinero.
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
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Nuevo producto
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Para {cook.displayName}
						</p>
					</div>

					<ProductForm
						cookId={cook.id}
						onSuccess={() => navigate(`/admin/cooks/${cook.id}/products`)}
					/>
				</>
			)}
		</div>
	);
}
