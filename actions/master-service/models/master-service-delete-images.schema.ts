import { z } from 'zod'

export const MasterServiceDeleteImagesPayloadSchema = z.object({
	fileIds: z.array(z.string()),
})

export const MasterServiceDeleteImagesResponseSchema = z.object({
	deletedCount: z.number(),
})

export type IMasterServiceDeleteImagesPayload = z.infer<
	typeof MasterServiceDeleteImagesPayloadSchema
>

export type IMasterServiceDeleteImagesResponse = z.infer<
	typeof MasterServiceDeleteImagesResponseSchema
>
