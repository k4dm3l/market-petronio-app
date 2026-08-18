import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetTags } from "@/entities/tags";
import { badgeVariants } from "@/shared/components/ui/badge";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/lib/utils";

const MAX_TAGS = 10;

interface TagsFieldProps {
	value: string[];
	onChange: (next: string[]) => void;
	id?: string;
	hasError?: boolean;
}

// Picks from the existing global tag catalog only — POST /api/tags is
// admin-only, so this selector can't create new tags on the fly. New tags
// get added from the admin Etiquetas module. Shared by every form that
// tags something against the same catalog (products, cook specialties, ...).
export function TagsField({ value, onChange, id, hasError }: TagsFieldProps) {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	// Fetched once (search is fixed at "") instead of per keystroke — up to
	// 100 tags is the whole catalog for this kind of business, so searching
	// stays local from here on instead of hitting the backend on every key.
	const { data: results, isFetching } = useGetTags("", 100);
	const atLimit = value.length >= MAX_TAGS;

	const normalizedQuery = query.trim().toLowerCase();
	const suggestions = useMemo(
		() =>
			(results ?? []).filter(
				(tag) =>
					!value.some((selected) => selected === tag.text) &&
					tag.text.toLowerCase().includes(normalizedQuery),
			),
		[results, value, normalizedQuery],
	);

	// Clamped instead of reset-via-effect: stays in range as the option list
	// changes without needing an extra render pass.
	const activeIndex = Math.min(
		highlightedIndex,
		Math.max(suggestions.length - 1, 0),
	);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const addTag = (text: string) => {
		if (value.length >= MAX_TAGS) return;
		onChange([...value, text]);
		setQuery("");
	};

	const removeTag = (text: string) => {
		onChange(value.filter((tag) => tag !== text));
	};

	return (
		<div ref={containerRef} className="relative">
			<div
				className={cn(
					"flex min-h-12 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
					hasError && "border-destructive",
				)}
			>
				{value.map((tag) => (
					<span
						key={tag}
						className={cn(
							badgeVariants({ variant: "secondary" }),
							"h-7 gap-1.5 px-2.5 text-sm",
						)}
					>
						{tag}
						<button
							type="button"
							onClick={() => removeTag(tag)}
							aria-label={`Quitar ${tag}`}
						>
							<X className="size-3.5" />
						</button>
					</span>
				))}

				<input
					id={id}
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							if (suggestions.length > 0) addTag(suggestions[activeIndex].text);
						} else if (
							event.key === "Backspace" &&
							query === "" &&
							value.length > 0
						) {
							removeTag(value[value.length - 1]);
						} else if (event.key === "ArrowDown") {
							event.preventDefault();
							setHighlightedIndex((i) =>
								Math.min(i + 1, suggestions.length - 1),
							);
						} else if (event.key === "ArrowUp") {
							event.preventDefault();
							setHighlightedIndex((i) => Math.max(i - 1, 0));
						} else if (event.key === "Escape") {
							setOpen(false);
						}
					}}
					placeholder={
						atLimit ? `Máximo ${MAX_TAGS} etiquetas` : "Buscar etiqueta..."
					}
					disabled={atLimit}
					autoComplete="off"
					className="h-7 min-w-32 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
				/>

				{isFetching && (
					<Spinner className="size-4 shrink-0 text-muted-foreground" />
				)}
			</div>

			{open && !atLimit && query.trim().length > 0 && (
				<ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
					{suggestions.length > 0 ? (
						suggestions.map((tag, index) => (
							<li key={tag.id}>
								<button
									type="button"
									onMouseDown={(event) => event.preventDefault()}
									onClick={() => addTag(tag.text)}
									onMouseEnter={() => setHighlightedIndex(index)}
									className={cn(
										"w-full px-2.5 py-2 text-left text-sm",
										activeIndex === index
											? "bg-accent text-accent-foreground"
											: "hover:bg-accent hover:text-accent-foreground",
									)}
								>
									{tag.text}
								</button>
							</li>
						))
					) : (
						<li className="px-2.5 py-2 text-sm text-muted-foreground">
							{isFetching ? "Buscando..." : "No se encontraron etiquetas"}
						</li>
					)}
				</ul>
			)}
		</div>
	);
}
