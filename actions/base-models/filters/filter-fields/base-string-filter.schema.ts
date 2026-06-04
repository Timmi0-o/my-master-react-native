import { z } from 'zod'

export const StringFilterSchema = z.object({
	value: z.array(z.string()),
	mode: z.enum(['OR', 'AND']),
})

export type IFormattedStringField = z.infer<typeof StringFilterSchema>
