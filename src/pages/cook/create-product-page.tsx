import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useGetMyCook } from "@/entities/cooks";
import { ProductForm } from "@/features/products";

export function CookCreateProductPage() {
	const navigate = useNavigate();
	const { data: cook, isPending, isError } = useGetMyCook();

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/products"
				className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Volver a productos
			</Link>

			{isPending && (
				<p className="text-sm text-muted-foreground">Cargando tu perfil...</p>
			)}

			{isError && (
				<p className="text-sm text-destructive">No se pudo cargar tu perfil.</p>
			)}

			{!isPending && !isError && !cook && (
				<p className="text-sm text-muted-foreground">
					No encontramos tu perfil de cocinero.
				</p>
			)}

			{cook && (
				<>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Nuevo producto
						</h1>
					</div>

					<ProductForm
						cookId={cook.id}
						cancelHref="/products"
						onSuccess={() => navigate("/products")}
					/>
				</>
			)}
		</div>
	);
}
