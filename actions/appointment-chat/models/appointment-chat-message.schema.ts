import { z } from 'zod'

export const AppointmentChatMessageSchema = z.object({
	id: z.string(),
	chatId: z.string(),
	senderUserId: z.string(),
	body: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().nullable().optional(),
})

export type IAppointmentChatMessage = z.infer<
	typeof AppointmentChatMessageSchema
>
