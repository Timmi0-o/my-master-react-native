import { z } from 'zod'
import { AppointmentChatMessageSchema } from '../appointment-chat-message.schema'

export const AppointmentChatWsMessageCreatedPayloadSchema = z.object({
	result: z.object({
		data: AppointmentChatMessageSchema,
	}),
})

export const AppointmentChatWsMessageDeletedPayloadSchema = z.object({
	result: z.object({
		data: z.object({
			chatId: z.string(),
			messageId: z.string(),
		}),
	}),
})

export const AppointmentChatWsAckErrorSchema = z.object({
	error: z.object({
		statusCode: z.number(),
		message: z.string(),
	}),
})

export type IAppointmentChatWsMessageCreatedPayload = z.infer<
	typeof AppointmentChatWsMessageCreatedPayloadSchema
>

export type IAppointmentChatWsMessageDeletedPayload = z.infer<
	typeof AppointmentChatWsMessageDeletedPayloadSchema
>
