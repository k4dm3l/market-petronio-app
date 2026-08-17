import { createBrowserRouter, Navigate } from "react-router";
import { RequireRole, RootRedirect } from "@/app/guards";
import { Role } from "@/entities/session";
import {
	AdminCategoriesPage,
	AdminConvertToCookPage,
	AdminCookProductsPage,
	AdminCooksPage,
	AdminCreateProductPage,
	AdminCustomersPage,
	AdminDashboardPage,
	AdminEditProductPage,
	AdminLayout,
	AdminOrdersPage,
	AdminProductsPage,
	AdminTagsPage,
} from "@/pages/admin";
import {
	LoginPage,
	RecoveryRequestPage,
	RecoveryResetPage,
	RegisterPage,
} from "@/pages/auth";
import {
	CookLayout,
	CookOrderDetailPage,
	CookOrdersPage,
	CookProductsPage,
} from "@/pages/cook";
import {
	CustomerCheckoutPage,
	CustomerOrdersPage,
	CustomerSearchPage,
} from "@/pages/customer";
import { NotFoundPage } from "@/pages/not-found";

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/recovery",
		element: <RecoveryRequestPage />,
	},
	{
		path: "/recovery/reset",
		element: <RecoveryResetPage />,
	},
	{
		path: "/",
		element: <RootRedirect />,
	},
	{
		path: "/admin",
		element: (
			<RequireRole roles={[Role.Admin]}>
				<AdminLayout />
			</RequireRole>
		),
		children: [
			{ index: true, element: <AdminDashboardPage /> },
			{ path: "dashboard", element: <AdminDashboardPage /> },
			{ path: "cooks", element: <AdminCooksPage /> },
			{ path: "cooks/:id/products", element: <AdminCookProductsPage /> },
			{
				path: "cooks/:id/products/new",
				element: <AdminCreateProductPage />,
			},
			{
				path: "cooks/:id/products/:productId/edit",
				element: <AdminEditProductPage />,
			},
			{ path: "customers", element: <AdminCustomersPage /> },
			{
				path: "customers/:id/convert-to-cook",
				element: <AdminConvertToCookPage />,
			},
			{ path: "categories", element: <AdminCategoriesPage /> },
			{ path: "tags", element: <AdminTagsPage /> },
			{ path: "orders", element: <AdminOrdersPage /> },
			{ path: "products", element: <AdminProductsPage /> },
			{ path: "*", element: <Navigate to="/admin" replace /> },
		],
	},
	{
		element: (
			<RequireRole roles={[Role.Cook]}>
				<CookLayout />
			</RequireRole>
		),
		children: [
			{ path: "orders", element: <CookOrdersPage /> },
			{ path: "orders/:id", element: <CookOrderDetailPage /> },
			{ path: "products", element: <CookProductsPage /> },
		],
	},
	{
		path: "/search",
		element: (
			<RequireRole roles={[Role.Customer]}>
				<CustomerSearchPage />
			</RequireRole>
		),
	},
	{
		path: "/my-orders",
		element: (
			<RequireRole roles={[Role.Customer]}>
				<CustomerOrdersPage />
			</RequireRole>
		),
	},
	{
		path: "/checkout",
		element: (
			<RequireRole roles={[Role.Customer]}>
				<CustomerCheckoutPage />
			</RequireRole>
		),
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
