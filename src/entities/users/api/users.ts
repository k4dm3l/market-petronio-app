import { http } from "@/shared/lib/http";
import type {
	ImageDeletedResponseDto,
	ImageUploadResponseDto,
	UpsertDeliveryInformationDto,
	UserMeResponseDto,
} from "../model/types";

export function getMe(): Promise<UserMeResponseDto> {
	return http.get<UserMeResponseDto>("/api/users/me").then((res) => res.data);
}

export function upsertDeliveryInformation(
	payload: UpsertDeliveryInformationDto,
): Promise<UserMeResponseDto> {
	return http
		.patch<UserMeResponseDto>("/api/users/me/delivery-information", payload)
		.then((res) => res.data);
}

// JPEG/PNG/WEBP, max 5 MB. Replaces any existing profile image.
export function uploadImage(file: File): Promise<ImageUploadResponseDto> {
	const formData = new FormData();
	formData.append("file", file);
	return http
		.post<ImageUploadResponseDto>("/api/users/me/image", formData)
		.then((res) => res.data);
}

export function deleteImage(): Promise<ImageDeletedResponseDto> {
	return http
		.delete<ImageDeletedResponseDto>("/api/users/me/image")
		.then((res) => res.data);
}
