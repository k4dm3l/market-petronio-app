import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
	useDeleteProfileImage,
	useUploadProfileImages,
} from "@/entities/users";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/lib/utils";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface PreviewImage {
	id: string;
	url: string;
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
		default:
			return `${fileName}: ${error.message}`;
	}
}

export function ProfileImageUploadField() {
	const [images, setImages] = useState<PreviewImage[]>([]);
	const uploadImages = useUploadProfileImages();
	const deleteImage = useDeleteProfileImage();

	const addFiles = async (files: File[]) => {
		if (files.length === 0) return;

		const results = await uploadImages.mutateAsync(files);

		const uploaded: PreviewImage[] = [];
		for (const result of results) {
			if (result.url) {
				uploaded.push({ id: crypto.randomUUID(), url: result.url });
			} else {
				toast.error(
					`${result.file.name}: ${result.error ?? "no se pudo subir"}`,
				);
			}
		}

		if (uploaded.length > 0) {
			// The server keeps a single profile image slot — the last upload to
			// settle is the one that stays, so only that image is worth previewing.
			setImages(uploaded.slice(-1));
			toast.success("Imagen de perfil actualizada");
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: { "image/*": [] },
		maxSize: MAX_SIZE_BYTES,
		multiple: true,
		disabled: uploadImages.isPending,
		onDrop: (acceptedFiles, fileRejections) => {
			addFiles(acceptedFiles);
			for (const rejection of fileRejections) {
				for (const error of rejection.errors) {
					toast.error(rejectionMessage(rejection.file.name, error));
				}
			}
		},
	});

	const removeImage = (id: string) => {
		deleteImage.mutate(undefined, {
			onSuccess: () => {
				setImages((prev) => prev.filter((image) => image.id !== id));
				toast.success("Imagen de perfil eliminada");
			},
		});
	};

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
			<div
				{...getRootProps()}
				className={cn(
					"flex w-full items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-8 text-muted-foreground transition-colors sm:max-w-md",
					!uploadImages.isPending && "cursor-pointer hover:bg-muted/50",
					isDragActive && "border-ring bg-muted/60",
					uploadImages.isPending && "cursor-not-allowed opacity-60",
				)}
			>
				<input {...getInputProps()} />
				{uploadImages.isPending ? (
					<Spinner className="size-7 shrink-0" />
				) : (
					<ImagePlus className="size-7 shrink-0" />
				)}
				<div className="text-left">
					<p className="text-base font-medium">
						{uploadImages.isPending
							? "Subiendo imagen..."
							: "Arrastrá o hacé click para subir"}
					</p>
					<p className="text-sm text-muted-foreground/70">
						Solo imágenes · máx. 5MB
					</p>
				</div>
			</div>

			{images.length > 0 && (
				<div className="flex flex-wrap gap-3">
					{images.map((image) => (
						<div
							key={image.id}
							className="group relative size-24 shrink-0 overflow-hidden rounded-xl border border-border"
						>
							<img
								src={image.url}
								alt="Foto de perfil"
								className="size-full object-cover"
							/>
							<button
								type="button"
								onClick={() => removeImage(image.id)}
								disabled={deleteImage.isPending}
								aria-label="Quitar imagen de perfil"
								className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
							>
								{deleteImage.isPending ? (
									<Spinner className="size-3.5" />
								) : (
									<X className="size-3.5" />
								)}
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
