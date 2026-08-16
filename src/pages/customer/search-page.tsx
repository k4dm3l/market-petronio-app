import { useMemo, useState } from "react";
import {
	CartSheet,
	FiltersSheet,
	Navbar,
	ProductGrid,
	SearchBar,
	Sidebar,
} from "./components";
import {
	countActiveFilters,
	EMPTY_FILTERS,
	filterProducts,
	hasActiveFilters,
	type ProductFilters,
} from "./filters";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_TAGS } from "./mock-data";

export function CustomerSearchPage() {
	const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
	const [isCartOpen, setIsCartOpen] = useState(false);

	const filteredProducts = useMemo(
		() => filterProducts(MOCK_PRODUCTS, filters),
		[filters],
	);
	const activeFilters = hasActiveFilters(filters);
	const activeCount = countActiveFilters(filters);
	const clearFilters = () => setFilters(EMPTY_FILTERS);

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<Navbar onOpenCart={() => setIsCartOpen(true)} />

			<div className="flex flex-1 overflow-hidden">
				<Sidebar
					categories={MOCK_CATEGORIES}
					tags={MOCK_TAGS}
					filters={filters}
					onChange={setFilters}
					onClear={clearFilters}
					hasActiveFilters={activeFilters}
					onOpenCart={() => setIsCartOpen(true)}
				/>

				<main className="flex-1 overflow-y-auto">
					<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
						<div className="sticky top-0 z-10 flex flex-col gap-4 bg-background pt-4 pb-6">
							<div>
								<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
									Sabores frescos del Pacífico
								</h1>
								<p className="mt-2 max-w-2xl text-muted-foreground">
									Mariscos, carnes y platos preparados por cocineras locales,
									listos para pedir hoy o encargar con anticipación.
								</p>
							</div>

							<SearchBar
								value={filters.search}
								onChange={(search) => setFilters({ ...filters, search })}
							/>

							<div className="flex items-center justify-between gap-3 lg:hidden">
								<FiltersSheet
									categories={MOCK_CATEGORIES}
									tags={MOCK_TAGS}
									filters={filters}
									onChange={setFilters}
									onClear={clearFilters}
									hasActiveFilters={activeFilters}
									activeCount={activeCount}
								/>
								<span className="text-sm text-muted-foreground">
									{filteredProducts.length} productos
								</span>
							</div>
						</div>

						<div className="mb-4 hidden items-center justify-between lg:flex">
							<span className="text-sm text-muted-foreground">
								{filteredProducts.length} productos
							</span>
						</div>

						<ProductGrid products={filteredProducts} />
					</div>
				</main>
			</div>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
