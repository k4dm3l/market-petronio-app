import { Outlet } from "react-router";
import { CookNavbar, CookSidebar } from "./components";

export function CookLayout() {
	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<CookNavbar />

			<div className="flex flex-1 overflow-hidden">
				<CookSidebar />

				<main className="flex-1 overflow-y-auto">
					<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
