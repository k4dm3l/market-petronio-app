import { Home } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
			<span className="text-8xl font-black text-primary sm:text-9xl">404</span>

			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-semibold sm:text-3xl">
					¡Ups! Página no encontrada
				</h1>
				<p className="max-w-md text-sm text-muted-foreground sm:text-base">
					No pudimos encontrar la página que buscás. Puede que el enlace esté
					roto o que se haya movido. Volvamos a un lugar conocido.
				</p>
			</div>

			<Button render={<Link to="/" />}>
				<Home className="size-4" />
				Volver al inicio
			</Button>
		</div>
	);
}
