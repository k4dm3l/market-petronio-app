import { NavLink } from "react-router";
import { cn } from "@/shared/lib/utils";
import { ADMIN_NAV_LINKS } from "./nav-links";

export function AdminSidebar() {
	return (
		<aside className="hidden w-64 shrink-0 border-r border-border lg:block">
			<div className="flex h-full flex-col overflow-y-auto p-6">
				<nav className="flex flex-col gap-1">
					{ADMIN_NAV_LINKS.map((link) => (
						<NavLink
							key={link.to}
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
						>
							<link.icon className="size-4" />
							{link.label}
						</NavLink>
					))}
				</nav>
			</div>
		</aside>
	);
}
