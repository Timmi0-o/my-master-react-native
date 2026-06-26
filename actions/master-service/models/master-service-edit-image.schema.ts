import { z } from 'zod'

export const LocalImageAssetSchema = z.object({
	uri: z.string().min(1),
	name: z.string().min(1),
	mimeType: z.string().min(1),
})

export const MasterServiceImageEditSchema = z.object({
	deleteIds: z.array(z.string()),
	newImages: z.array(LocalImageAssetSchema),
})

export type ILocalImageAsset = z.infer<typeof LocalImageAssetSchema>
export type IMasterServiceImageEdit = z.input<typeof MasterServiceImageEditSchema>
export type IMasterServiceImageEditPayload = z.output<
	typeof MasterServiceImageEditSchema
>
