import { z } from 'zod'

export const UserProfileSchema = z.object({
	id: z.string(),
	userId: z.string(),
	displayName: z.string(),
	rating: z.number(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
})

export const UserProfileGetManyParamsSchema = z.object({
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

export const UserProfileGetOneParamsSchema = z.object({
	preset: z.enum(['MINIMAL', 'SHORT', 'BASE']).optional(),
})

export type IUserProfile = z.infer<typeof UserProfileSchema>
export type IUserProfileGetManyParams = z.infer<
	typeof UserProfileGetManyParamsSchema
>
export type IUserProfileGetOneParams = z.infer<
	typeof UserProfileGetOneParamsSchema
>
