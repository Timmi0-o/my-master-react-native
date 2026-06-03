import { z } from 'zod'

export const MasterProfileServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	price: z.number().optional(),
	masterProfileId: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
})

export const MasterProfileSchema = z.object({
	id: z.string(),
	userId: z.string(),
	displayName: z.string(),
	description: z.string(),
	rating: z.number(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	services: z.array(MasterProfileServiceSchema).optional(),
})

export const MasterProfileGetManyParamsSchema = z.object({
	preset: z.enum(['MINIMAL', 'SHORT', 'BASE']).optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	orderField: z
		.enum([
			'id',
			'userId',
			'displayName',
			'rating',
			'createdAt',
			'updatedAt',
		])
		.optional(),
	orderDir: z.enum(['asc', 'desc']).optional(),
	filter: z.record(z.string(), z.unknown()).optional(),
})

export type IMasterProfileService = z.infer<typeof MasterProfileServiceSchema>
export type IMasterProfile = z.infer<typeof MasterProfileSchema>
export type IMasterProfileGetManyParams = z.infer<
	typeof MasterProfileGetManyParamsSchema
>
