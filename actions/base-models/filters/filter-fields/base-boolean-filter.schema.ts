import { z } from 'zod'

export const BooleanFilterSchema = z.boolean()

export type IFormattedBooleanField = z.infer<typeof BooleanFilterSchema>
