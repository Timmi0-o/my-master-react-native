import { z } from 'zod'

export const StrictRangeSchema = z.object({
	lt: z.string(),
	gt: z.string(),
})

export type IStrictRange = z.infer<typeof StrictRangeSchema>
