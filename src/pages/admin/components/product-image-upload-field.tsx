import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import type { ProductImageItemDto } from "@/entities/products";
import { removeImage, uploadImage } from "@/entities/products";
import { Spinner } from "@/shared/components/ui/spinner";
import { queryKeys } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { cn } from "@/shared/lib/utils";

const MAX_IMAGES = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const TILE_CLASS = "aspect-square w-28 shrink-0 sm:w-32";

interface PendingUpload {
	id: string;
	file: File;
	previewUrl: string;
	status: "uploading" | "error";
	error?: string;
}

interface ProductImageUploadFieldProps {
	/** Product's persisted images (edit mode). Removable. */
	existingImages?: ProductImageItemDto[];
	/**
	 * Newly uploaded temp images (from POST /products/images), staged for
	 * CreateProductDto.images. A state setter (not a plain callback) — uploads
	 * run concurrently and resolve in any order, so appends/removals use the
	 * functional updater form to stay correct regardless of ordering.
	 */
	value: ProductImageItemDto[];
	onChange: Dispatch<SetStateAction<ProductImageItemDto[]>>;
	/** Shows a reminder that new images still need "Guardar cambios" to persist. */
	isEditMode?: boolean;
}

function rejectionMessage(
	fileName: string,
	error: { code: string; message: string },
) {
	switch (error.code) {
		case "file-invalid-type":
			return `${fileName}: solo se permiten imágenes`;
		case "file-too-large":
			return `${fileName}: supera el máximo de 5MB`;
		case "too-many-files":
			return `Máximo ${MAX_IMAGES} imágenes por producto`;
		default:
			return `${fileName}: ${error.message}`;
	}
}

export function ProductImageUploadField({
	existingImages = [],
	value,
	onChange,
	isEditMode = false,
}: ProductImageUploadFieldProps) {
	const queryClient = useQueryClient();
	const [pending, setPending] = useState<PendingUpload[]>([]);

	const totalCount = existingImages.length + value.length + pending.length;
	const remainingSlots = Math.max(0, MAX_IMAGES - totalCount);

	// Calls the raw API functions directly rather than going through a shared
	// useMutation() instance: firing .mutate() several times concurrently on
	// one mutation observer overwrites its single `mutateOptions` slot each
	// call, so an earlier still-in-flight call's onSuccess/onError can get
	// silently dropped when a later call supersedes it before it settles —
	// exactly the "spinner stuck forever on the 2nd image" symptom. Plain
	// promises per call have no such shared state to clobber.
	const uploadOne = (file: File) => {
		const tempId = crypto.randomUUID();
		const previewUrl = URL.createObjectURL(file);
		setPending((prev) => [
			...prev,
			{ id: tempId, file, previewUrl, status: "uploading" },
		]);

		uploadImage(file)
			.then((result) => {
				const image = result.images[0];
				URL.revokeObjectURL(previewUrl);
				// If dismissPending() already removed this tempId, `prev` won't
				// contain it — that's how we know it was cancelled mid-flight
				// (no ref needed: the pending list itself is the source of truth).
				let wasDismissed = false;
				setPending((prev) => {
					wasDismissed = !prev.some((item) => item.id === tempId);
					return prev.filter((item) => item.id !== tempId);
				});
				if (wasDismissed) {
					if (image) removeImage(image.id).catch(() => {});
					return;
				}
				if (image) onChange((prev) => [...prev, image]);
			})
			.catch((error: unknown) => {
				let wasDismissed = false;
				setPending((prev) => {
					wasDismissed = !prev.some((item) => item.id === tempId);
					return prev;
				});
				if (wasDismissed) return;
				setPending((prev) =>
					prev.map((item) =>
						item.id === tempId
							? { ...item, status: "error", error: getErrorMessage(error) }
							: item,
					),
				);
			});
	};

	const retryUpload = (item: PendingUpload) => {
		URL.revokeObjectURL(item.previewUrl);
		setPending((prev) => prev.filter((p) => p.id !== item.id));
		uploadOne(item.file);
	};

	const dismissPending = (id: string) => {
		setPending((prev) => {
			const item = prev.find((p) => p.id === id);
			if (item) URL.revokeObjectURL(item.previewUrl);
			return prev.filter((p) => p.id !== id);
		});
	};

	const addFiles = (files: File[]) => {
		if (files.length === 0) return;
		const accepted = files.slice(0, remainingSlots);
		if (accepted.length < files.length) {
			toast.error(`Máximo ${MAX_IMAGES} imágenes por producto`);
		}
		for (const file of accepted) uploadOne(file);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: { "image/*": [] },
		maxSize: MAX_SIZE_BYTES,
		multiple: true,
		disabled: remainingSlots <= 0,
		onDrop: (acceptedFiles, fileRejections) => {
			addFiles(acceptedFiles);
			for (const rejection of fileRejections) {
				for (const error of rejection.errors) {
					toast.error(rejectionMessage(rejection.file.name, error));
				}
			}
		},
	});

	const removeStagedAt = (imageId: string) => {
		onChange((prev) => prev.filter((image) => image.id !== imageId));
		removeImage(imageId).catch((error: unknown) => {
			toast.error(getErrorMessage(error));
		});
	};

	const removeExistingAt = (imageId: string) => {
		removeImage(imageId)
			.then(() => {
				// Broad "products" prefix — covers both the admin list and this
				// product's detail query (edit page reads via useGetProduct).
				queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
			})
			.catch((error: unknown) => {
				toast.error(getErrorMessage(error));
			});
	};

	const slots = [
		...existingImages.map((image) => ({ kind: "existing" as const, image })),
		...value.map((image) => ({ kind: "staged" as const, image })),
		...pending.map((upload) => ({ kind: "pending" as const, upload })),
	];

	const hasUnsavedNewImages = isEditMode && value.length > 0;

	return (
		<div className="flex flex-col gap-3">
			<div
				{...getRootProps()}
				className={cn(
					"flex h-[150px] w-full items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 text-muted-foreground transition-colors",
					remainingSlots > 0 && "cursor-pointer hover:bg-muted/50",
					isDragActive && "border-ring bg-muted/60",
					remainingSlots <= 0 && "cursor-not-allowed opacity-50",
				)}
			>
				<input {...getInputProps()} />
				<ImagePlus className="size-7 shrink-0" />
				<div className="text-left">
					<p className="text-base font-medium">
						{remainingSlots <= 0
							? "Máximo de imágenes alcanzado"
							: "Arrastrá o hacé click para subir"}
					</p>
					<p className="text-sm text-muted-foreground/70">
						Solo imágenes · máx. {MAX_IMAGES} · 5MB c/u
					</p>
				</div>
			</div>

			{hasUnsavedNewImages && (
				<p className="rounded-lg border border-amber-600/15 bg-amber-600/10 px-3 py-2 text-sm text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400">
					Tenés {value.length} imagen{value.length > 1 ? "es" : ""} nueva
					{value.length > 1 ? "s" : ""} sin guardar. Hacé clic en "Guardar
					cambios" para aplicarlas al producto.
				</p>
			)}

			{/* Always rendered — even empty — so the row's height is reserved
			    up front and the page doesn't jump once the first upload lands. */}
			<div className="flex gap-3 overflow-x-auto pb-1">
				{slots.length === 0
					? Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className={cn(
									TILE_CLASS,
									"flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground/60",
									index >= 2 && "hidden sm:flex",
								)}
							>
								<ImagePlus className="size-5" />
							</div>
						))
					: slots.map((slot, position) => {
							const isCover = position === 0;

							if (slot.kind === "pending") {
								const { upload } = slot;
								return (
									<div
										key={`pending-${upload.id}`}
										className={cn(
											TILE_CLASS,
											"relative overflow-hidden rounded-xl border border-border",
										)}
									>
										<img
											src={upload.previewUrl}
											alt="Subiendo imagen"
											className="size-full object-cover"
										/>
										<div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-background/85 text-center">
											{upload.status === "uploading" ? (
												<Spinner className="size-5" />
											) : (
												<>
													<span className="px-2 text-[11px] font-medium text-destructive">
														Error al subir
													</span>
													<div className="flex gap-1.5">
														<button
															type="button"
															onClick={() => retryUpload(upload)}
															className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-foreground ring-1 ring-border hover:bg-muted"
														>
															Reintentar
														</button>
														<button
															type="button"
															onClick={() => dismissPending(upload.id)}
															aria-label="Quitar imagen"
															className="flex size-5 items-center justify-center rounded-full bg-background text-foreground ring-1 ring-border hover:bg-muted"
														>
															<X className="size-3" />
														</button>
													</div>
												</>
											)}
										</div>
									</div>
								);
							}

							const { image } = slot;
							return (
								<div
									key={image.id}
									className={cn(
										TILE_CLASS,
										"group relative overflow-hidden rounded-xl border border-border",
									)}
								>
									<img
										src={image.url}
										alt={`Imagen ${position + 1}`}
										className="size-full object-cover"
									/>
									{isCover && (
										<span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-foreground">
											Portada
										</span>
									)}
									<button
										type="button"
										onClick={() =>
											slot.kind === "existing"
												? removeExistingAt(image.id)
												: removeStagedAt(image.id)
										}
										aria-label={`Quitar imagen ${position + 1}`}
										className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
									>
										<X className="size-3.5" />
									</button>
								</div>
							);
						})}
			</div>
		</div>
	);
}
