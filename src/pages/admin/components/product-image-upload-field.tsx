import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import type { ProductImageItemDto } from "@/entities/products";
import { useRemoveProductImage, useUploadProductImage } from "@/entities/products";
import { Spinner } from "@/shared/components/ui/spinner";
import { getErrorMessage } from "@/shared/lib/error";
import { cn } from "@/shared/lib/utils";

const MAX_IMAGES = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

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
	/** Newly uploaded temp images (from POST /products/images), staged for CreateProductDto.images. */
	value: ProductImageItemDto[];
	onChange: (next: ProductImageItemDto[]) => void;
	/**
	 * false in edit mode — UpdateProductDto has no `images` field, so a new
	 * image can't be attached to a product that already exists. Only
	 * removing existing images is possible then.
	 */
	canAddImages?: boolean;
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
	canAddImages = true,
}: ProductImageUploadFieldProps) {
	const uploadProductImage = useUploadProductImage();
	const removeStagedImage = useRemoveProductImage();
	const removeExistingImage = useRemoveProductImage();
	const [pending, setPending] = useState<PendingUpload[]>([]);
	// tempIds dismissed while their upload was still in flight — when the
	// request settles we just clean up instead of reviving the preview.
	const dismissedRef = useRef<Set<string>>(new Set());

	const totalCount = existingImages.length + value.length + pending.length;
	const remainingSlots = Math.max(0, MAX_IMAGES - totalCount);

	const uploadOne = (file: File) => {
		const tempId = crypto.randomUUID();
		const previewUrl = URL.createObjectURL(file);
		setPending((prev) => [
			...prev,
			{ id: tempId, file, previewUrl, status: "uploading" },
		]);

		uploadProductImage.mutate(file, {
			onSuccess: (result) => {
				const image = result.images[0];
				URL.revokeObjectURL(previewUrl);
				if (dismissedRef.current.has(tempId)) {
					dismissedRef.current.delete(tempId);
					if (image) removeStagedImage.mutate(image.id);
					return;
				}
				setPending((prev) => prev.filter((item) => item.id !== tempId));
				if (image) onChange([...value, image]);
			},
			onError: (error) => {
				if (dismissedRef.current.has(tempId)) {
					dismissedRef.current.delete(tempId);
					return;
				}
				setPending((prev) =>
					prev.map((item) =>
						item.id === tempId
							? { ...item, status: "error", error: getErrorMessage(error) }
							: item,
					),
				);
			},
		});
	};

	const retryUpload = (item: PendingUpload) => {
		URL.revokeObjectURL(item.previewUrl);
		setPending((prev) => prev.filter((p) => p.id !== item.id));
		uploadOne(item.file);
	};

	const dismissPending = (id: string) => {
		dismissedRef.current.add(id);
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
		disabled: !canAddImages || remainingSlots <= 0,
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
		removeStagedImage.mutate(imageId, {
			onSuccess: () => onChange(value.filter((image) => image.id !== imageId)),
		});
	};

	const slots = [
		...existingImages.map((image) => ({ kind: "existing" as const, image })),
		...value.map((image) => ({ kind: "staged" as const, image })),
		...pending.map((upload) => ({ kind: "pending" as const, upload })),
	];

	return (
		<div className="flex flex-col gap-3">
			{canAddImages ? (
				<div
					{...getRootProps()}
					className={cn(
						"flex w-full items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-8 text-muted-foreground transition-colors",
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
			) : (
				<p className="text-sm text-muted-foreground">
					Las imágenes solo se pueden agregar al crear el producto. Desde acá
					podés quitar las existentes.
				</p>
			)}

			{slots.length > 0 && (
				<div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
					{slots.map((slot, position) => {
						const isCover = position === 0;

						if (slot.kind === "pending") {
							const { upload } = slot;
							return (
								<div
									key={`pending-${upload.id}`}
									className="relative aspect-square overflow-hidden rounded-xl border border-border"
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
								className="group relative aspect-square overflow-hidden rounded-xl border border-border"
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
											? removeExistingImage.mutate(image.id)
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
			)}
		</div>
	);
}
