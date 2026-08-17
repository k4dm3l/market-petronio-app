import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useGetProduct } from "@/entities/products";
import { ProductForm } from "./components/product-form";

export function AdminEditProductPage() {
	const { id = "", productId = "" } = useParams();
	const navigate = useNavigate();
	const { data: product, isPending, isError } = useGetProduct(productId);

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
				<p className="text-sm text-muted-foreground">Cargando producto...</p>
			)}

			{isError && (
				<p className="text-sm text-destructive">
					No se pudo cargar el producto.
				</p>
			)}

			{!isPending && !isError && !product && (
				<p className="text-sm text-muted-foreground">
					Producto no encontrado.{" "}
					<Link to={`/admin/cooks/${id}/products`} className="underline">
						Volver a productos
					</Link>
				</p>
			)}

			{product && (
				<>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Editar producto
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
					</div>

					<ProductForm
						cookId={product.cookId}
						product={product}
						onSuccess={() =>
							navigate(`/admin/cooks/${product.cookId}/products`)
						}
					/>
				</>
			)}
		</div>
	);
}
