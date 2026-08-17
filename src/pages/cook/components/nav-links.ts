import {
	ClipboardList,
	LayoutDashboard,
	type LucideIcon,
	Package,
} from "lucide-react";

export interface CookNavLink {
	to: string;
	label: string;
	icon: LucideIcon;
	end?: boolean;
}

export const COOK_NAV_LINKS: CookNavLink[] = [
	{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
	{ to: "/orders", label: "Pedidos", icon: ClipboardList },
	{ to: "/products", label: "Mis productos", icon: Package },
];
