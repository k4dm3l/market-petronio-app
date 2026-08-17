import { useEffect, useRef, useState } from "react";
import type { LocationSuggestion } from "@/entities/geolocation";
import { useSearchLocations } from "@/entities/geolocation";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/lib/utils";

interface LocationSearchFieldProps {
	value: string;
	onSelect: (suggestion: LocationSuggestion) => void;
	hasError?: boolean;
	id?: string;
}

export function LocationSearchField({
	value,
	onSelect,
	hasError,
	id,
}: LocationSearchFieldProps) {
	const [query, setQuery] = useState(value);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: suggestions, isFetching } = useSearchLocations(query);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (suggestion: LocationSuggestion) => {
		setQuery(suggestion.name);
		setOpen(false);
		onSelect(suggestion);
	};

	const showResults = open && query.trim().length >= 3;

	return (
		<div ref={containerRef} className="relative">
			<Input
				id={id}
				value={query}
				onChange={(event) => {
					setQuery(event.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				placeholder="Buscar ciudad o dirección en Colombia"
				aria-invalid={hasError}
				autoComplete="off"
			/>

			{isFetching && (
				<Spinner className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground" />
			)}

			{showResults && (suggestions?.length ?? 0) > 0 && (
				<ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
					{suggestions?.map((suggestion) => (
						<li key={suggestion.id}>
							<button
								type="button"
								onClick={() => handleSelect(suggestion)}
								className={cn(
									"w-full px-2.5 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
								)}
							>
								{suggestion.name}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
