import { Menu } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "@/shared/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/lib/utils";
import { ADMIN_NAV_LINKS } from "./nav-links";

export function AdminMenuSheet() {
	return (
		<Sheet>
			<SheetTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="lg:hidden"
						aria-label="Abrir menú"
					/>
				}
			>
				<Menu className="size-5" />
			</SheetTrigger>
			<SheetContent side="left" className="w-full max-w-xs p-4">
				<SheetHeader className="p-0">
					<SheetTitle>Menú</SheetTitle>
				</SheetHeader>

				<nav className="mt-4 flex flex-col gap-1">
					{ADMIN_NAV_LINKS.map((link) => (
						<SheetClose
							key={link.to}
							nativeButton={false}
							render={
								<NavLink
									to={link.to}
									end={link.end}
									className={({ isActive }) =>
										cn(
											"flex h-12 items-center gap-2 rounded-lg px-2 text-sm font-medium transition-colors",
											isActive
												? "bg-primary text-primary-foreground"
												: "text-foreground hover:bg-muted",
										)
									}
								/>
							}
						>
							<link.icon className="size-4" />
							{link.label}
						</SheetClose>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
