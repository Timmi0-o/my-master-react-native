import { z } from 'zod'

export const MasterServicePresignImageFileSchema = z.object({
	name: z.string().min(1),
	sha256sum: z.string().min(1),
})

export const MasterServicePresignImagesPayloadSchema = z.object({
	files: z.array(MasterServicePresignImageFileSchema).min(1),
})

export const MasterServicePresignImagesResponseItemSchema = z.object({
	imageId: z.string(),
	fileId: z.string(),
	name: z.string(),
	path: z.string(),
	url: z.string(),
})

export const MasterServicePresignImagesResponseSchema = z.array(
	MasterServicePresignImagesResponseItemSchema,
)

export type IMasterServicePresignImageFile = z.infer<
	typeof MasterServicePresignImageFileSchema
>

export type IMasterServicePresignImagesPayload = z.infer<
	typeof MasterServicePresignImagesPayloadSchema
>

export type IMasterServicePresignImagesResponseItem = z.infer<
	typeof MasterServicePresignImagesResponseItemSchema
>

export type IMasterServicePresignImagesResponse = z.infer<
	typeof MasterServicePresignImagesResponseSchema
>
