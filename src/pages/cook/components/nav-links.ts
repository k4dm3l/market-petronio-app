import { ClipboardList, type LucideIcon, Package } from "lucide-react";

export interface CookNavLink {
	to: string;
	label: string;
	icon: LucideIcon;
	end?: boolean;
}

export const COOK_NAV_LINKS: CookNavLink[] = [
	{ to: "/orders", label: "Pedidos", icon: ClipboardList, end: true },
	{ to: "/products", label: "Mis productos", icon: Package },
];
