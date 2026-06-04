import { z } from 'zod'
import { InclusiveRangeSchema } from './base-inclusive-range.schema'
import { StrictRangeSchema } from './base-strict-range.schema'

export const RangeFilterSchema = z.object({
	value: z.array(z.union([StrictRangeSchema, InclusiveRangeSchema])),
	mode: z.literal('OR'),
})

export type IFormattedRangeField = z.infer<typeof RangeFilterSchema>
