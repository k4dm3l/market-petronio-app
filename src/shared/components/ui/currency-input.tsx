import type { ComponentProps } from "react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

function formatGroups(value: number): string {
	return new Intl.NumberFormat("es-CO").format(value);
}

interface CurrencyInputProps
	extends Omit<ComponentProps<typeof Input>, "value" | "onChange" | "type"> {
	value: number;
	onChange: (value: number) => void;
}

/**
 * A COP amount input: shows thousands-grouped digits behind a fixed `$`
 * prefix and reports a plain integer to `onChange`. Never reports
 * `undefined` — an emptied field reports `0` so it stays a valid `number`
 * for a `z.number()` schema, letting `.positive()`/`.min()` produce the
 * real "required" message instead of Zod's generic type-mismatch one.
 */
function CurrencyInput({
	value,
	onChange,
	className,
	...props
}: CurrencyInputProps) {
	return (
		<div className="relative">
			<span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">
				$
			</span>
			<Input
				{...props}
				type="text"
				inputMode="numeric"
				value={value === 0 ? "" : formatGroups(value)}
				onChange={(event) => {
					const digits = event.target.value.replace(/\D/g, "");
					onChange(digits === "" ? 0 : Number(digits));
				}}
				className={cn("pl-6", className)}
			/>
		</div>
	);
}

export { CurrencyInput };
