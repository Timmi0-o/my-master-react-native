import { z } from 'zod'

export const MasterServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
})

export const MasterSchema = z.object({
	id: z.string(),
	name: z.string(),
	rating: z.number(),
	reviewsCount: z.number(),
	services: z.array(MasterServiceSchema),
})

export type IMaster = z.infer<typeof MasterSchema>
export type IMasterService = z.infer<typeof MasterServiceSchema>
