import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useUploadProductImage } from "@/entities/products";
import { Spinner } from "@/shared/components/ui/spinner";
import { getErrorMessage } from "@/shared/lib/error";
import { cn } from "@/shared/lib/utils";

const MAX_IMAGES = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface ExistingProductImage {
	id: string;
	url: string;
}

interface ProductImageUploadFieldProps {
	/**
	 * Product being edited. When present, dropped files upload immediately to
	 * `POST /api/products/:id/images`. When absent — creating a product that
	 * doesn't exist yet — files are staged via `newFiles`/`onNewFilesChange`
	 * for the caller to upload once the product has been created.
	 */
	productId?: string;
	existingImages?: ExistingProductImage[];
	onRemoveExisting?: (imageId: string) => void;
	newFiles: File[];
	onNewFilesChange: (files: File[]) => void;
}

interface PendingUpload {
	id: string;
	file: File;
	previewUrl: string;
	status: "uploading" | "error";
	error?: string;
}

type Slot =
	| { kind: "existing"; id: string; url: string }
	| { kind: "staged"; index: number; url: string }
	| { kind: "pending"; upload: PendingUpload };

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
	productId,
	existingImages = [],
	onRemoveExisting,
	newFiles,
	onNewFilesChange,
}: ProductImageUploadFieldProps) {
	const uploadProductImage = useUploadProductImage();
	const [pending, setPending] = useState<PendingUpload[]>([]);
	// Images uploaded during this session that `existingImages` (owned by the
	// parent's product query) hasn't caught up with yet after the refetch.
	const [uploaded, setUploaded] = useState<ExistingProductImage[]>([]);
	// Files show as "uploading" the moment they're dropped, but the actual
	// requests run one at a time — firing them concurrently races the
	// server's read-modify-write on the product's images array and can leave
	// a request hanging forever.
	const uploadQueueRef = useRef(Promise.resolve());

	const stagedPreviews = useMemo(
		() => newFiles.map((file) => URL.createObjectURL(file)),
		[newFiles],
	);

	useEffect(() => {
		return () => {
			for (const url of stagedPreviews) URL.revokeObjectURL(url);
		};
	}, [stagedPreviews]);

	const optimisticUploaded = uploaded.filter(
		(image) => !existingImages.some((existing) => existing.id === image.id),
	);

	const totalCount =
		existingImages.length +
		optimisticUploaded.length +
		newFiles.length +
		pending.length;
	const remainingSlots = Math.max(0, MAX_IMAGES - totalCount);

	const uploadNow = (targetProductId: string, file: File) => {
		const tempId = crypto.randomUUID();
		const previewUrl = URL.createObjectURL(file);
		setPending((prev) => [
			...prev,
			{ id: tempId, file, previewUrl, status: "uploading" },
		]);

		uploadQueueRef.current = uploadQueueRef.current.then(async () => {
			try {
				const result = await uploadProductImage.mutateAsync({
					id: targetProductId,
					file,
				});
				setUploaded((prev) => [...prev, { id: result.id, url: result.url }]);
				setPending((prev) => prev.filter((item) => item.id !== tempId));
				URL.revokeObjectURL(previewUrl);
			} catch (error) {
				setPending((prev) =>
					prev.map((item) =>
						item.id === tempId
							? { ...item, status: "error", error: getErrorMessage(error) }
							: item,
					),
				);
			}
		});
	};

	const retryUpload = (item: PendingUpload) => {
		if (!productId) return;
		URL.revokeObjectURL(item.previewUrl);
		setPending((prev) => prev.filter((p) => p.id !== item.id));
		uploadNow(productId, item.file);
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
		if (accepted.length === 0) return;

		if (productId) {
			for (const file of accepted) uploadNow(productId, file);
		} else {
			onNewFilesChange([...newFiles, ...accepted]);
		}
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

	const removeStagedAt = (index: number) => {
		onNewFilesChange(newFiles.filter((_, i) => i !== index));
	};

	// Existing (already uploaded) images first — the server treats images[0]
	// as the cover — then locally staged or in-flight files.
	const slots: Slot[] = [
		...existingImages.map((image) => ({
			kind: "existing" as const,
			id: image.id,
			url: image.url,
		})),
		...optimisticUploaded.map((image) => ({
			kind: "existing" as const,
			id: image.id,
			url: image.url,
		})),
		...newFiles.map((_, index) => ({
			kind: "staged" as const,
			index,
			url: stagedPreviews[index],
		})),
		...pending.map((upload) => ({ kind: "pending" as const, upload })),
	];

	return (
		<div className="flex flex-col gap-3">
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

						return (
							<div
								key={slot.kind === "existing" ? slot.id : `staged-${slot.index}`}
								className="group relative aspect-square overflow-hidden rounded-xl border border-border"
							>
								<img
									src={slot.url}
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
											? onRemoveExisting?.(slot.id)
											: removeStagedAt(slot.index)
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
