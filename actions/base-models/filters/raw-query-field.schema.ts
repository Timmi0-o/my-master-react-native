import z from 'zod'
import { FieldTypes } from './field-types.schema'

export const RawQueryFieldSchema = z.object({
	value: z.string().or(z.array(z.string())),
	mode: z.enum(['OR', 'AND', 'PARTIAL', 'STRICT']).optional(),
	periodMode: z.enum(['STRICT', 'INCLUSIVE']).optional(),
	fieldType: z.enum(FieldTypes),
	key: z.string(),
})

export type IRawQueryField = z.infer<typeof RawQueryFieldSchema>
