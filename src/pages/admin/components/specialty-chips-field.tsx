import { X } from "lucide-react";
import { useState } from "react";
import { badgeVariants } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface SpecialtyChipsFieldProps {
	value: string[];
	onChange: (next: string[]) => void;
	id?: string;
	hasError?: boolean;
}

export function SpecialtyChipsField({
	value,
	onChange,
	id,
	hasError,
}: SpecialtyChipsFieldProps) {
	const [draft, setDraft] = useState("");

	const addSpecialty = () => {
		const trimmed = draft.trim();
		if (!trimmed) return;
		const exists = value.some(
			(item) => item.toLowerCase() === trimmed.toLowerCase(),
		);
		if (!exists) onChange([...value, trimmed]);
		setDraft("");
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<Input
					id={id}
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							addSpecialty();
						}
					}}
					placeholder="Ej: Mariscos, Tamales..."
					aria-invalid={hasError}
				/>
				<Button type="button" variant="outline" onClick={addSpecialty}>
					Agregar
				</Button>
			</div>

			{value.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{value.map((item) => (
						<span
							key={item}
							className={cn(
								badgeVariants({ variant: "secondary" }),
								"h-7 gap-1.5 px-2.5 text-sm",
							)}
						>
							{item}
							<button
								type="button"
								onClick={() =>
									onChange(value.filter((specialty) => specialty !== item))
								}
								aria-label={`Quitar ${item}`}
							>
								<X className="size-3.5" />
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
