import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/entities/session";
import { Toaster } from "@/shared/components/ui/sonner";
import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./app/providers/cart-provider.tsx";
import { QueryProvider } from "./app/providers/query-provider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryProvider>
			<AuthProvider>
				<CartProvider>
					<App />
					<Toaster />
				</CartProvider>
			</AuthProvider>
		</QueryProvider>
	</StrictMode>,
);
