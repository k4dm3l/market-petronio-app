import { useMemo, useState } from "react";
import { useGetCategories } from "@/entities/categories";
import { useGetProducts } from "@/entities/products";
import { useGetTags } from "@/entities/tags";
import { Skeleton } from "@/shared/components/ui/skeleton";
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

export function CustomerSearchPage() {
	const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
	const [isCartOpen, setIsCartOpen] = useState(false);

	// Loaded once and filtered client-side below — category/tag chips are
	// multi-select, which /api/products (single categoryId) can't express in
	// one request, so search/category/tag/price all apply locally over this
	// page instead of round-tripping per filter change.
	const {
		data: products,
		isPending: isProductsPending,
		isError: isProductsError,
	} = useGetProducts({ limit: 100 });
	const { data: categories } = useGetCategories({ limit: 100 });
	const { data: tags } = useGetTags("", 100);

	const filteredProducts = useMemo(
		() => filterProducts(products ?? [], filters),
		[products, filters],
	);
	const activeFilters = hasActiveFilters(filters);
	const activeCount = countActiveFilters(filters);
	const clearFilters = () => setFilters(EMPTY_FILTERS);
	const tagTexts = useMemo(() => tags?.map((tag) => tag.text) ?? [], [tags]);

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<Navbar onOpenCart={() => setIsCartOpen(true)} />

			<div className="flex flex-1 overflow-hidden">
				<Sidebar
					categories={categories ?? []}
					tags={tagTexts}
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
									categories={categories ?? []}
									tags={tagTexts}
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

						{isProductsError && (
							<p className="text-sm text-destructive">
								No se pudieron cargar los productos.
							</p>
						)}

						{isProductsPending ? (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								{Array.from({ length: 6 }).map((_, index) => (
									<Skeleton key={index} className="aspect-[4/5] rounded-2xl" />
								))}
							</div>
						) : (
							<ProductGrid products={filteredProducts} />
						)}
					</div>
				</main>
			</div>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
