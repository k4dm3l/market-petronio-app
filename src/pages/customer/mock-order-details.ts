import type { OrderResponseDto } from "@/entities/orders";

// No backend data yet for this customer to test against — shaped exactly
// like OrderResponseDto (GET /api/orders/{id}, the single-order detail
// endpoint) so swapping useGetOrder(id) back in later is a drop-in
// replacement. mock-orders.ts (the list summary shape) is derived from this.
export const MOCK_ORDER_DETAILS: OrderResponseDto[] = [
	{
		id: "order-1",
		orderNumber: "ORDER-000101",
		customerId: "customer-me",
		cookId: "cook-1",
		items: [
			{
				productId: "prod-encocado-camaron",
				name: "Encocado de camarón",
				quantity: 2,
				unitPrice: 37000,
				total: 74000,
			},
		],
		totals: { subtotal: 74000, shipping: 8000, total: 82000 },
		delivery: {
			location: { type: "Point", coordinates: [-77.0319, 3.8833] },
			address: "Calle 5 #10-20, Buenaventura",
			additionalInformation: "Casa azul, junto a la panadería",
		},
		payment: {
			status: "PAID",
			method: "nequi",
			customerReportedPaid: true,
			paidAt: "2026-08-10T15:35:00.000Z",
		},
		shipping: {
			status: "DELIVERED",
			carrier: "Servientrega",
			trackingNumber: "112233445",
			shippedAt: "2026-08-10T16:00:00.000Z",
			deliveredAt: "2026-08-10T19:20:00.000Z",
		},
		status: "DELIVERED",
		customerConfirmation: {
			confirmed: true,
			confirmedAt: "2026-08-10T19:30:00.000Z",
		},
		createdAt: "2026-08-10T15:30:00.000Z",
		updatedAt: "2026-08-10T19:30:00.000Z",
	},
	{
		id: "order-2",
		orderNumber: "ORDER-000102",
		customerId: "customer-me",
		cookId: "cook-2",
		items: [
			{
				productId: "prod-patacones-camaron",
				name: "Patacones con camarón",
				quantity: 1,
				unitPrice: 25000,
				total: 25000,
			},
			{
				productId: "prod-viche",
				name: "Viche del Pacífico",
				quantity: 1,
				unitPrice: 16000,
				total: 16000,
			},
		],
		totals: { subtotal: 41000, shipping: 6000, total: 47000 },
		delivery: {
			location: { type: "Point", coordinates: [-77.0341, 3.8901] },
			address: "Carrera 12 #4-18, Buenaventura",
		},
		payment: {
			status: "PAID",
			method: "daviplata",
			customerReportedPaid: true,
			paidAt: "2026-08-12T11:50:00.000Z",
		},
		shipping: {
			status: "SHIPPED",
			carrier: "Servientrega",
			trackingNumber: "998877665",
			shippedAt: "2026-08-12T13:00:00.000Z",
		},
		status: "SHIPPED",
		customerConfirmation: { confirmed: false },
		createdAt: "2026-08-12T12:00:00.000Z",
		updatedAt: "2026-08-12T13:00:00.000Z",
	},
	{
		id: "order-3",
		orderNumber: "ORDER-000103",
		customerId: "customer-me",
		cookId: "cook-1",
		items: [
			{
				productId: "prod-arroz-atapado",
				name: "Arroz atapado",
				quantity: 1,
				unitPrice: 18000,
				total: 18000,
			},
			{
				productId: "prod-tamal-pescado",
				name: "Tamal de pescado",
				quantity: 1,
				unitPrice: 12000,
				total: 12000,
			},
		],
		totals: { subtotal: 30000, shipping: 5000, total: 35000 },
		delivery: {
			location: { type: "Point", coordinates: [-77.0298, 3.8795] },
			address: "Barrio Bellavista, casa 22, Buenaventura",
			additionalInformation: "Tocar el timbre dos veces",
		},
		payment: {
			status: "PAYMENT_INSTRUCTIONS",
			method: "nequi",
			customerReportedPaid: false,
		},
		shipping: { status: "PREPARING" },
		status: "PREPARING",
		customerConfirmation: { confirmed: false },
		createdAt: "2026-08-14T09:15:00.000Z",
		updatedAt: "2026-08-14T09:20:00.000Z",
	},
	{
		id: "order-4",
		orderNumber: "ORDER-000104",
		customerId: "customer-me",
		cookId: "cook-3",
		items: [
			{
				productId: "prod-ceviche-camaron",
				name: "Ceviche de camarón",
				quantity: 1,
				unitPrice: 18000,
				total: 18000,
			},
		],
		totals: { subtotal: 18000, shipping: 4000, total: 22000 },
		delivery: {
			location: { type: "Point", coordinates: [-77.0355, 3.8842] },
			address: "Calle 3 #8-45, Buenaventura",
		},
		payment: {
			status: "CANCELLED",
			method: "nequi",
			customerReportedPaid: false,
		},
		shipping: { status: "PENDING" },
		status: "CANCELLED",
		customerConfirmation: { confirmed: false },
		createdAt: "2026-08-05T18:45:00.000Z",
		updatedAt: "2026-08-06T08:00:00.000Z",
	},
];
