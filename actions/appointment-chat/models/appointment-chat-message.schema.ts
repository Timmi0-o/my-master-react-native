import { z } from 'zod'

export const AppointmentChatMessageActorSchema = z.enum([
	'USER',
	'SYSTEM',
	'SUPPORT',
])

export const EAppointmentChatMessageActor =
	AppointmentChatMessageActorSchema.enum

export const AppointmentChatMessageSchema = z.object({
	id: z.string(),
	chatId: z.string(),
	senderUserId: z.string().nullable(),
	actor: AppointmentChatMessageActorSchema,
	body: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().nullable().optional(),
})

export type IAppointmentChatMessage = z.infer<
	typeof AppointmentChatMessageSchema
>
