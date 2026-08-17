import { ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import pacificoImg from "@/shared/assets/pacifico-hero.png";

interface AuthLayoutProps {
	title: string;
	description: string;
	children: ReactNode;
	footer?: ReactNode;
}

export function AuthLayout({
	title,
	description,
	children,
	footer,
}: AuthLayoutProps) {
	return (
		<div className="flex h-screen w-full overflow-hidden">
			<div className="relative hidden h-full w-1/2 lg:block">
				<img
					src={pacificoImg}
					alt="Platos tradicionales del Pacífico colombiano"
					className="h-full w-full object-cover object-top"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/50 to-black/70" />
			</div>

			<div className="relative flex h-full w-full flex-col justify-center overflow-y-auto px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
				>
					<div className="absolute -top-28 -right-20 size-72 rounded-full bg-primary/25 blur-3xl" />
					<div className="absolute -bottom-28 -left-20 size-72 rounded-full bg-primary/25 blur-3xl" />
				</div>

				<div className="relative z-10 mx-auto w-full max-w-sm">
					<div className="mb-8 flex items-center gap-2 text-primary">
						<ShoppingBag className="size-6" />
						<span className="text-xl font-bold tracking-tight">
							Petronio Market
						</span>
					</div>

					<h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
					<p className="mt-1 text-sm md:text-base text-muted-foreground">
						{description}
					</p>

					<div className="mt-8">{children}</div>

					{footer && (
						<div className="mt-6 text-center text-sm text-muted-foreground">
							{footer}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
