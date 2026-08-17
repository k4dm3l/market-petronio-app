import { ArrowLeft, MapPin, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useCart } from "@/entities/cart";
import type { CreateOrderDeliveryDto } from "@/entities/orders";
import { useCreateOrder } from "@/entities/orders";
import { useGetMe } from "@/entities/users";
import { AddressFormDialog, type AddressFormValue } from "@/features/address";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/lib/format";
import { getErrorMessage } from "@/shared/lib/error";
import { cn } from "@/shared/lib/utils";
import { CartLineItem, CartSheet, Navbar } from "./components";

type DeliveryChoice =
	| { source: "CUSTOMER_PROFILE" }
	| {
			source: "CUSTOM";
			address: string;
			latitude: number;
			longitude: number;
			additionalInformation?: string;
	  };

export function CustomerCheckoutPage() {
	const { items, subtotal, clear } = useCart();
	const { data: me } = useGetMe();
	const createOrder = useCreateOrder();
	const navigate = useNavigate();

	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
	// null = no explicit choice yet, so it falls back to the saved profile
	// address (once loaded) below — the user only has to act to override it.
	const [deliveryOverride, setDeliveryOverride] =
		useState<DeliveryChoice | null>(null);
	const [isPlacingOrder, setIsPlacingOrder] = useState(false);

	const primaryAddress =
		me?.addresses.find((address) => address.isPrimary) ?? me?.addresses[0];
	const currentAddressText =
		primaryAddress?.address ?? me?.deliveryInformation?.address ?? null;
	const hasProfileAddress = Boolean(currentAddressText);

	const delivery: DeliveryChoice | null =
		deliveryOverride ??
		(hasProfileAddress ? { source: "CUSTOMER_PROFILE" } : null);

	// Cart items can span multiple cooks, but the API only accepts a single
	// cookId per order — so we group by cook and place one order per group.
	const cookGroups = useMemo(() => {
		const groups = new Map<string, typeof items>();
		for (const item of items) {
			const group = groups.get(item.product.cookId) ?? [];
			group.push(item);
			groups.set(item.product.cookId, group);
		}
		return groups;
	}, [items]);

	const canPlaceOrder = items.length > 0 && delivery !== null && !isPlacingOrder;

	const handleAddressSubmit = (value: AddressFormValue) => {
		setDeliveryOverride({
			source: "CUSTOM",
			address: value.address,
			latitude: value.latitude,
			longitude: value.longitude,
			additionalInformation: value.additionalInformation,
		});
		setIsAddressDialogOpen(false);
	};

	const handlePlaceOrder = async () => {
		if (!delivery) return;

		const deliveryDto: CreateOrderDeliveryDto =
			delivery.source === "CUSTOMER_PROFILE"
				? { source: "CUSTOMER_PROFILE" }
				: {
						source: "CUSTOM",
						address: delivery.address,
						location: {
							type: "Point",
							coordinates: [delivery.longitude, delivery.latitude],
						},
						additionalInformation: delivery.additionalInformation,
					};

		setIsPlacingOrder(true);
		try {
			for (const [cookId, cookItems] of cookGroups) {
				await createOrder.mutateAsync({
					cookId,
					items: cookItems.map((item) => ({
						productId: item.product.id,
						quantity: item.quantity,
					})),
					delivery: deliveryDto,
				});
			}
			toast.success("Pedido realizado con éxito");
			clear();
			navigate("/search");
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setIsPlacingOrder(false);
		}
	};

	if (items.length === 0) {
		return (
			<div className="flex h-screen flex-col overflow-hidden bg-background">
				<Navbar onOpenCart={() => setIsCartOpen(true)} />
				<main className="flex flex-1 items-center justify-center p-6">
					<div className="flex flex-col items-center gap-2 text-center">
						<ShoppingCart className="size-10 text-muted-foreground" />
						<p className="text-sm font-medium">Tu carrito está vacío</p>
						<p className="text-sm text-muted-foreground">
							Agrega productos del catálogo para continuar.
						</p>
						<Button className="mt-2" render={<Link to="/search" />}>
							Ir al catálogo
						</Button>
					</div>
				</main>
				<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<Navbar onOpenCart={() => setIsCartOpen(true)} />

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
					<Link
						to="/search"
						className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-4" />
						Volver al catálogo
					</Link>

					<h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
						Finalizar pedido
					</h1>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
						<div className="flex flex-col gap-6">
							<div>
								<div className="mb-3 flex items-center justify-between">
									<h2 className="text-xl font-semibold">Tu pedido</h2>
									<Link
										to="/search"
										className="text-sm font-medium text-accent hover:text-accent/80"
									>
										Agregar más productos
									</Link>
								</div>
								<ul className="flex flex-col gap-4 rounded-2xl border border-border p-4">
									{items.map((item) => (
										<CartLineItem key={item.product.id} item={item} />
									))}
								</ul>
							</div>

							<div>
								<h2 className="mb-3 text-xl font-semibold">
									Dirección de entrega
								</h2>
								<div className="flex flex-col gap-3">
									<button
										type="button"
										disabled={!hasProfileAddress}
										onClick={() =>
											setDeliveryOverride({ source: "CUSTOMER_PROFILE" })
										}
										className={cn(
											"flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
											delivery?.source === "CUSTOMER_PROFILE"
												? "border-primary bg-primary/5"
												: "border-border hover:bg-muted/40",
											!hasProfileAddress && "cursor-not-allowed opacity-50",
										)}
									>
										<MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
										<div className="flex flex-col gap-0.5">
											<span className="text-sm font-semibold">
												Usar mi dirección actual
											</span>
											<span className="text-sm text-muted-foreground">
												{hasProfileAddress
													? currentAddressText
													: "No tienes una dirección guardada"}
											</span>
										</div>
									</button>

									<button
										type="button"
										onClick={() => setIsAddressDialogOpen(true)}
										className={cn(
											"flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
											delivery?.source === "CUSTOM"
												? "border-primary bg-primary/5"
												: "border-border hover:bg-muted/40",
										)}
									>
										<MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
										<div className="flex flex-col gap-0.5">
											<span className="text-sm font-semibold">
												{delivery?.source === "CUSTOM"
													? "Nueva dirección"
													: "Agregar una nueva dirección"}
											</span>
											<span className="text-sm text-muted-foreground">
												{delivery?.source === "CUSTOM"
													? delivery.address
													: "Ingresa una dirección distinta para este pedido"}
											</span>
										</div>
									</button>
								</div>
							</div>
						</div>

						<div className="flex h-fit flex-col gap-4 rounded-2xl border border-border p-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Subtotal</span>
								<span className="text-lg font-bold">
									{formatCurrency(subtotal)}
								</span>
							</div>
							<p className="text-xs text-muted-foreground">
								El pago se coordina directamente con la cocinera al recibir el
								pedido.
							</p>
							<Button
								type="button"
								className="w-full"
								disabled={!canPlaceOrder}
								onClick={handlePlaceOrder}
							>
								{isPlacingOrder ? "Enviando pedido..." : "Finalizar orden"}
							</Button>
						</div>
					</div>
				</div>
			</main>

			<AddressFormDialog
				open={isAddressDialogOpen}
				onOpenChange={setIsAddressDialogOpen}
				onSubmit={handleAddressSubmit}
				title="Agregar dirección de entrega"
				description="Busca la dirección donde quieres recibir este pedido."
			/>

			<CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
		</div>
	);
}
