import { z } from 'zod'

export const LimitFilterSchema = z.number().optional()

export type ILimitField = z.infer<typeof LimitFilterSchema>
