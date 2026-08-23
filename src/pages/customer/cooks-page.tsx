import { useMemo, useState } from "react";
import { useSearchCooks } from "@/entities/cooks";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
	CartSheet,
	CookFiltersPanel,
	CookGrid,
	FiltersSheet,
	Navbar,
	SearchBar,
	Sidebar,
	ViewSwitch,
} from "./components";
import {
	type CookFilters,
	countActiveCookFilters,
	EMPTY_COOK_FILTERS,
	hasActiveCookFilters,
} from "./cook-filters";

export function CustomerCooksPage() {
	const [filters, setFilters] = useState<CookFilters>(EMPTY_COOK_FILTERS);
	const [isCartOpen, setIsCartOpen] = useState(false);

	// Search and specialties are filtered server-side (GET /api/cooks), so
	// this only fetches the page matching the current filters.
	const {
		data: cooks,
		isPending: isCooksPending,
		isError: isCooksError,
	} = useSearchCooks({
		search: filters.search,
		specialties: filters.specialties,
	});

	// A separate, unfiltered fetch purely to build the "Especialidades" chip
	// vocabulary — there's no dedicated specialty catalog, so this mirrors
	// how the product view derives its chip list from a broad tag fetch.
	const { data: allCooks } = useSearchCooks({ limit: 100 });
	const specialtyOptions = useMemo(
		() =>
			Array.from(
				new Set((allCooks ?? []).flatMap((cook) => cook.specialties)),
			).sort((a, b) => a.localeCompare(b)),
		[allCooks],
	);

	const activeFilters = hasActiveCookFilters(filters);
	const activeCount = countActiveCookFilters(filters);
	const clearFilters = () => setFilters(EMPTY_COOK_FILTERS);

	const filtersPanel = (
		<CookFiltersPanel
			specialties={specialtyOptions}
			filters={filters}
			onChange={setFilters}
			onClear={clearFilters}
			hasActiveFilters={activeFilters}
		/>
	);

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<Navbar onOpenCart={() => setIsCartOpen(true)} />

			<div className="flex flex-1 overflow-hidden">
				<Sidebar onOpenCart={() => setIsCartOpen(true)}>{filtersPanel}</Sidebar>

				<main className="flex-1 overflow-y-auto">
					<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
						<div className="sticky top-0 z-10 flex flex-col gap-4 bg-background pt-4 pb-6">
							<ViewSwitch />

							<div>
								<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
									Cocineras del Pacífico
								</h1>
								<p className="mt-2 max-w-2xl text-muted-foreground">
									Conoce a las cocineras locales y explora lo que preparan.
								</p>
							</div>

							<SearchBar
								value={filters.search}
								onChange={(search) => setFilters({ ...filters, search })}
							/>

							<div className="flex items-center justify-between gap-3 lg:hidden">
								<FiltersSheet activeCount={activeCount}>
									{filtersPanel}
								</FiltersSheet>
								<span className="text-sm text-muted-foreground">
									{cooks?.length ?? 0} cocineras
								</span>
							</div>
						</div>

						<div className="mb-4 hidden items-center justify-between lg:flex">
							<span className="text-sm text-muted-foreground">
								{cooks?.length ?? 0} cocineras
							</span>
						</div>

						{isCooksError && (
							<p className="text-sm text-destructive">
								No se pudieron cargar las cocineras.
							</p>
						)}

						{isCooksPending ? (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								{Array.from({ length: 6 }).map((_, index) => (
									<Skeleton key={index} className="h-48 rounded-2xl" />
								))}
							</div>
						) : (
							<CookGrid cooks={cooks ?? []} />
						)}
					</div>
				</main>
			</div>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
