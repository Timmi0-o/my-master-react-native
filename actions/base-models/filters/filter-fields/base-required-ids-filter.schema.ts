import { z } from 'zod'

export const RequiredIdsFilterSchema = z.array(z.string())

export type IFormattedRequiredIdsField = z.infer<typeof RequiredIdsFilterSchema>
