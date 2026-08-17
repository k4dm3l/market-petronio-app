import {
	ChefHat,
	MapPinOff,
	MoreVertical,
	ShieldCheck,
	UserRoundCheck,
	UserRoundX,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import type { UserMeResponseDto } from "@/entities/users";
import { usePromoteAdmin, useSetCustomerActive } from "@/entities/users";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return (first + last).toUpperCase();
}

interface CustomerRowProps {
	customer: UserMeResponseDto;
}

export function CustomerRow({ customer }: CustomerRowProps) {
	const { mutate, isPending } = useSetCustomerActive();
	const { mutate: promote, isPending: isPromoting } = usePromoteAdmin();
	const [promoteOpen, setPromoteOpen] = useState(false);
	const address = customer.deliveryInformation?.address;

	return (
		<div className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:gap-5 sm:px-6">
			<Avatar size="lg" className="shrink-0">
				{customer.image?.url && (
					<AvatarImage src={customer.image.url} alt={customer.name} />
				)}
				<AvatarFallback className="bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 font-semibold text-primary">
					{getInitials(customer.name)}
				</AvatarFallback>
			</Avatar>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="truncate font-semibold text-foreground">
					{customer.name}
				</span>
				<span className="truncate text-sm text-muted-foreground">
					{customer.email}
				</span>
			</div>

			<div className="hidden w-52 shrink-0 flex-col gap-0.5 md:flex">
				<span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
					Dirección
				</span>
				{address ? (
					<span className="truncate text-sm text-foreground">{address}</span>
				) : (
					<span className="flex items-center gap-1 text-sm text-muted-foreground/70">
						<MapPinOff className="size-3.5" />
						Sin registrar
					</span>
				)}
			</div>

			<Badge
				className={cn(
					"shrink-0 border",
					customer.isActive
						? "border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
						: "border-transparent bg-muted text-muted-foreground",
				)}
			>
				{customer.isActive ? "Activo" : "Inactivo"}
			</Badge>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={`Acciones para ${customer.name}`}
							disabled={isPending || isPromoting}
						/>
					}
				>
					<MoreVertical className="size-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() =>
								mutate({
									id: customer.id,
									payload: { isActive: !customer.isActive },
								})
							}
						>
							{customer.isActive ? (
								<UserRoundX className="size-5" />
							) : (
								<UserRoundCheck className="size-5" />
							)}
							{customer.isActive ? "Desactivar cliente" : "Activar cliente"}
						</DropdownMenuItem>
						<DropdownMenuItem
							render={
								<Link to={`/admin/customers/${customer.id}/convert-to-cook`} />
							}
						>
							<ChefHat className="size-5" />
							Convertir en cocinero
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setPromoteOpen(true)}>
							<ShieldCheck className="size-5" />
							Convertir en administrador
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={promoteOpen} onOpenChange={setPromoteOpen}>
				<AlertDialogContent className="p-6 sm:max-w-[500px]">
					<AlertDialogHeader className="grid-rows-1 place-items-start gap-2 text-left sm:place-items-start sm:text-left">
						<AlertDialogTitle className="text-2xl">
							Convertir en administrador
						</AlertDialogTitle>
						<AlertDialogDescription>
							¿Estás seguro de que deseas convertir a {customer.name} en
							administrador? Esta acción le otorgará acceso completo al panel de
							administración.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="-mx-6 -mb-6 p-6">
						<AlertDialogCancel disabled={isPromoting}>
							Cancelar
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPromoting}
							onClick={() =>
								promote(customer.id, {
									onSuccess: () => setPromoteOpen(false),
								})
							}
						>
							{isPromoting ? "Convirtiendo..." : "Convertir"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export function CustomerRowSkeleton() {
	return (
		<div className="flex items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
			<Skeleton className="size-10 shrink-0 rounded-full" />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-3 w-44" />
			</div>
			<Skeleton className="hidden h-8 w-40 md:block" />
			<Skeleton className="h-5 w-16 shrink-0 rounded-full" />
			<Skeleton className="size-8 shrink-0 rounded-lg" />
		</div>
	);
}
