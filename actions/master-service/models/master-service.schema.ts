import { z } from 'zod'
import { MasterProfileSchema } from '@/actions/master/models/master-profile.schema'

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
export type IMasterServiceGetManyParams = z.infer<
	typeof MasterServiceGetManyParamsSchema
>
