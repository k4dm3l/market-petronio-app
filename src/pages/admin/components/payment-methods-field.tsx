import { Plus, Trash2 } from "lucide-react";
import { Controller, type Control, useFieldArray, useWatch } from "react-hook-form";
import { PAYMENT_METHOD_OPTIONS, type PaymentMethodCategory } from "@/entities/cooks";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import type { ConvertToCookFormValues } from "../schemas/convert-to-cook.schema";

const CATEGORY_LABELS: Record<PaymentMethodCategory, string> = {
	wallet: "Billeteras",
	bank: "Bancos",
	bank_transfer: "PSE",
	card: "Tarjeta",
	instant_transfer: "Transferencia instantánea",
	cash: "Efectivo",
};

const CATEGORY_DETAILS_PLACEHOLDER: Record<PaymentMethodCategory, string> = {
	wallet: "Número de celular asociado",
	bank: "Número de cuenta",
	bank_transfer: "Correo o documento asociado a PSE",
	card: "Notas sobre la tarjeta (opcional)",
	instant_transfer: "Llave Bre-B (celular, correo o documento)",
	cash: "Nota adicional (opcional)",
};

const FIELD_LABEL_CLASS =
	"text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase";

type PaymentMethodOption = (typeof PAYMENT_METHOD_OPTIONS)[number];

const GROUPED_OPTIONS = PAYMENT_METHOD_OPTIONS.reduce<
	Partial<Record<PaymentMethodCategory, PaymentMethodOption[]>>
>((acc, option) => {
	(acc[option.category] ??= []).push(option);
	return acc;
}, {});

interface PaymentMethodRowProps {
	control: Control<ConvertToCookFormValues>;
	index: number;
	onRemove: () => void;
}

function PaymentMethodRow({ control, index, onRemove }: PaymentMethodRowProps) {
	const type = useWatch({ control, name: `paymentMethods.${index}.type` });
	const category = PAYMENT_METHOD_OPTIONS.find((option) => option.id === type)
		?.category;
	const placeholder = category
		? CATEGORY_DETAILS_PLACEHOLDER[category]
		: "Detalles";

	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end">
			<div className="flex flex-1 flex-col gap-1.5">
				<span className={FIELD_LABEL_CLASS}>Banco / Método</span>
				<Controller
					control={control}
					name={`paymentMethods.${index}.type`}
					render={({ field }) => (
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{(
									Object.entries(GROUPED_OPTIONS) as [
										PaymentMethodCategory,
										PaymentMethodOption[],
									][]
								).map(([groupCategory, options]) => (
									<SelectGroup key={groupCategory}>
										<SelectLabel>{CATEGORY_LABELS[groupCategory]}</SelectLabel>
										{options.map((option) => (
											<SelectItem key={option.id} value={option.id}>
												{option.name}
											</SelectItem>
										))}
									</SelectGroup>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			</div>

			<div className="flex flex-1 flex-col gap-1.5">
				<span className={FIELD_LABEL_CLASS}>Cuenta / Teléfono</span>
				<Controller
					control={control}
					name={`paymentMethods.${index}.details`}
					render={({ field }) => <Input {...field} placeholder={placeholder} />}
				/>
			</div>

			<div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-center sm:justify-center sm:gap-1.5">
				<span className={FIELD_LABEL_CLASS}>Habilitado</span>
				<Controller
					control={control}
					name={`paymentMethods.${index}.isEnabled`}
					render={({ field }) => (
						<Switch
							checked={field.value}
							onCheckedChange={field.onChange}
							aria-label="Habilitar método de pago"
						/>
					)}
				/>
			</div>

			<Button
				type="button"
				variant="destructive"
				size="icon"
				onClick={onRemove}
				aria-label="Quitar método de pago"
				className="order-first self-end shrink-0 sm:order-none sm:self-auto"
			>
				<Trash2 className="size-4" />
			</Button>
		</div>
	);
}

interface PaymentMethodsFieldProps {
	control: Control<ConvertToCookFormValues>;
}

export function PaymentMethodsField({ control }: PaymentMethodsFieldProps) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "paymentMethods",
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-end">
				<Button
					type="button"
					variant="link"
					className="h-auto p-0"
					onClick={() => append({ type: "nequi", details: "", isEnabled: true })}
				>
					<Plus className="size-4" />
					Agregar método
				</Button>
			</div>

			{fields.length === 0 && (
				<p className="rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
					Todavía no agregaste métodos de pago.
				</p>
			)}

			{fields.map((field, index) => (
				<PaymentMethodRow
					key={field.id}
					control={control}
					index={index}
					onRemove={() => remove(index)}
				/>
			))}
		</div>
	);
}
