export {
	create,
	findAll,
	findOne,
	nearby,
	remove,
	removeImage,
	update,
	uploadImage,
} from "./api/products";
export {
	useCreateProduct,
	useGetAllProducts,
	useGetAllProductsInfinite,
	useGetProduct,
	useRemoveProductImage,
	useSetProductActive,
	useUpdateProduct,
	useUploadProductImage,
} from "./hooks";
export type {
	CreateProductDto,
	FindNearbyProductsQuery,
	FindProductsQuery,
	Product,
	ProductAvailability,
	ProductImageItemDto,
	ProductImagesUploadResponseDto,
	UpdateProductDto,
} from "./model/types";
