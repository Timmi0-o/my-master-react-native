import { z } from 'zod'
import { MasterProfileSchema } from '@/actions/master/models/master-profile.schema'

const MasterServiceImageFileSchema = z.object({
	id: z.string(),
	fileUrl: z.string(),
	originalName: z.string(),
	mimeType: z.string(),
	fileType: z.string(),
	purpose: z.string(),
	status: z.string(),
	fileSize: z.number(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
})

const MasterServiceImageSchema = z.object({
	id: z.string(),
	masterServiceId: z.string(),
	fileId: z.string(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	file: MasterServiceImageFileSchema.optional(),
})

export const MasterServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	durationMinutes: z.number().optional(),
	masterProfileId: z.string(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	masterProfile: MasterProfileSchema.pick({
		id: true,
		userId: true,
		displayName: true,
		description: true,
		rating: true,
	}).optional(),
	images: z.array(MasterServiceImageSchema).optional(),
})

export const MasterServiceGetManyParamsSchema = z.object({
	preset: z.enum(['MINIMAL', 'SHORT', 'BASE']).optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	orderField: z
		.enum(['id', 'name', 'price', 'masterProfileId', 'createdAt', 'updatedAt'])
		.optional(),
	orderDir: z.enum(['asc', 'desc']).optional(),
	filter: z.record(z.string(), z.unknown()).optional(),
})

export type IMasterService = z.infer<typeof MasterServiceSchema>
export type IMasterServiceImage = z.infer<typeof MasterServiceImageSchema>
export type IMasterServiceGetManyParams = z.infer<
	typeof MasterServiceGetManyParamsSchema
>
