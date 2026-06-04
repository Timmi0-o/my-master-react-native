import { z } from 'zod'

export const MasterProfileServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	price: z.number().optional(),
	durationMinutes: z.number().optional(),
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

export type IMasterProfileService = z.infer<typeof MasterProfileServiceSchema>
export type IMasterProfile = z.infer<typeof MasterProfileSchema>
