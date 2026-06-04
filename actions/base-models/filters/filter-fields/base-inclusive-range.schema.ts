import { z } from 'zod'

export const InclusiveRangeSchema = z.object({
	lte: z.string(),
	gte: z.string(),
})

export type IInclusiveRange = z.infer<typeof InclusiveRangeSchema>
