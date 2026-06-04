import { z } from 'zod'

export const ListOrderDirSchema = z.enum(['asc', 'desc'])

export type IListOrderDir = z.infer<typeof ListOrderDirSchema>
