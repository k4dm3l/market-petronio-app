export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(value);
}

export function formatDate(value: string): string {
	return new Intl.DateTimeFormat("es-CO", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(value));
}
