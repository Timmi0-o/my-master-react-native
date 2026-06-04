import { z } from 'zod'
import { AppointmentChatMessageSchema } from './appointment-chat-message.schema'

const AppointmentChatAppointmentSchema = z.object({
	id: z.string(),
	masterProfileId: z.string(),
	clientUserId: z.string(),
	startsAt: z.string(),
	status: z.string(),
	serviceName: z.string().optional(),
	masterProfile: z
		.object({
			id: z.string(),
			displayName: z.string(),
		})
		.optional(),
	clientUser: z
		.object({
			id: z.string(),
			name: z.string(),
			surname: z.string(),
			patronymic: z.string().nullable().optional(),
		})
		.optional(),
})

export const AppointmentChatSchema = z.object({
	id: z.string(),
	appointmentId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().nullable().optional(),
	appointment: AppointmentChatAppointmentSchema.optional(),
	messages: z.array(AppointmentChatMessageSchema).optional(),
})

export type IAppointmentChat = z.infer<typeof AppointmentChatSchema>
