import { z } from 'zod'

export const RecordServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
})

export const RecordClientSchema = z.object({
	id: z.string(),
	name: z.string(),
	phone: z.string(),
	email: z.string(),
})

export const RecordSchema = z.object({
	id: z.string(),
	name: z.string(),
	date: z.string(),
	time: z.string(),
	service: RecordServiceSchema,
	client: RecordClientSchema,
})

export type IRecord = z.infer<typeof RecordSchema>
export type IRecordService = z.infer<typeof RecordServiceSchema>
export type IRecordClient = z.infer<typeof RecordClientSchema>
