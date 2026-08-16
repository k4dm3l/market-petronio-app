import { Outlet } from "react-router";
import { AdminNavbar, AdminSidebar } from "./components";

export function AdminLayout() {
	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<AdminNavbar />

			<div className="flex flex-1 overflow-hidden">
				<AdminSidebar />

				<main className="flex-1 overflow-y-auto">
					<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
