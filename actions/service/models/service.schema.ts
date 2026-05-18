import { z } from 'zod'

export const ServiceMasterSchema = z.object({
	id: z.string(),
	surname: z.string(),
	name: z.string(),
	patronymic: z.string(),
	rating: z.number(),
})

export const RecommendedServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	master: ServiceMasterSchema,
})

export type IServiceMaster = z.infer<typeof ServiceMasterSchema>
export type IRecommendedService = z.infer<typeof RecommendedServiceSchema>
