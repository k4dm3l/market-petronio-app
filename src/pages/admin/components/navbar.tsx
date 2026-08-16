import { LogOut, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/entities/session";
import { Button } from "@/shared/components/ui/button";
import { AdminMenuSheet } from "./menu-sheet";

export function AdminNavbar() {
	const { user, signOut } = useAuth();

	return (
		<header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-4 sm:px-6 lg:px-8">
			<div className="flex w-full items-center gap-2">
				<AdminMenuSheet />

				<Link to="/admin" className="flex items-center gap-2 text-primary">
					<ShoppingBag className="size-5" />
					<span className="text-lg font-bold tracking-tight">
						Petroneo Admin
					</span>
				</Link>

				<div className="ml-auto flex items-center gap-1 lg:gap-3">
					{user && (
						<span className="hidden text-sm text-muted-foreground sm:inline">
							Hola, {user.name.split(" ")[0]}
						</span>
					)}

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={signOut}
						aria-label="Cerrar sesión"
					>
						<LogOut className="size-5" />
					</Button>
				</div>
			</div>
		</header>
	);
}
