import { z } from 'zod'

export const AppointmentChatMessageActorSchema = z.enum([
	'USER',
	'SYSTEM',
	'SUPPORT',
])

export const EAppointmentChatMessageActor =
	AppointmentChatMessageActorSchema.enum

export const AppointmentChatSystemActionSchema = z.enum([
	'APPOINTMENT_CREATED',
	'APPOINTMENT_CONFIRMED',
	'APPOINTMENT_CANCELLED',
])

export const EAppointmentChatSystemAction =
	AppointmentChatSystemActionSchema.enum

export const AppointmentChatMessageSchema = z.object({
	id: z.string(),
	chatId: z.string(),
	senderUserId: z.string().nullable(),
	actor: AppointmentChatMessageActorSchema,
	body: z.string().nullable(),
	systemAction: AppointmentChatSystemActionSchema.nullable().optional(),
	payload: z.unknown().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().nullable().optional(),
})

export type IAppointmentChatMessage = z.infer<
	typeof AppointmentChatMessageSchema
>
