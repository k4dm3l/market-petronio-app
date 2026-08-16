import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
	return (
		<div className="relative w-full">
			<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="Buscar encocado, camarones..."
				className="w-full pl-9"
				aria-label="Buscar productos"
			/>
		</div>
	);
}
