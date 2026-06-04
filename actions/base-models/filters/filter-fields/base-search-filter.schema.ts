import { z } from 'zod'

export const SearchFilterSchema = z.object({
	value: z.string(),
	mode: z.enum(['PARTIAL', 'STRICT']),
})

export type ISearchFieldValue = z.infer<typeof SearchFilterSchema>

export type ISearchField = ISearchFieldValue | undefined
