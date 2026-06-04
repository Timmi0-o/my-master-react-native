import { z } from 'zod'

/** Скалярные query-поля (orderField, orderDir и т.п.). */
export const ScalarQueryFieldSchema = z.string()

export type IScalarQueryField = z.infer<typeof ScalarQueryFieldSchema>
