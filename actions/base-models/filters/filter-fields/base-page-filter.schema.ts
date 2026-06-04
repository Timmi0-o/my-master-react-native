import { z } from 'zod'

export const PageFilterSchema = z.number().optional()

export type IPageField = z.infer<typeof PageFilterSchema>
