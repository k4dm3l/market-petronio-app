import {
	ChefHat,
	ClipboardList,
	LayoutDashboard,
	type LucideIcon,
	Package,
	Tag,
	Users,
} from "lucide-react";

export interface AdminNavLink {
	to: string;
	label: string;
	icon: LucideIcon;
	end?: boolean;
}

export const ADMIN_NAV_LINKS: AdminNavLink[] = [
	{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
	{ to: "/admin/cooks", label: "Cocineros", icon: ChefHat },
	{ to: "/admin/customers", label: "Clientes", icon: Users },
	{ to: "/admin/categories", label: "Categorías", icon: Tag },
	{ to: "/admin/orders", label: "Pedidos", icon: ClipboardList },
	{ to: "/admin/products", label: "Productos", icon: Package },
];
