import type { IAppointmentChat } from '@/actions/appointment-chat/models/appointment-chat.schema'
import type { IAppointmentChatMessage } from '@/actions/appointment-chat/models/appointment-chat-message.schema'
import type { QueryClient } from '@tanstack/react-query'

const appointmentChatQueryKey = (chatId: string) =>
	['appointment-chat', chatId] as const

export const upsertAppointmentChatMessageInCache = (
	queryClient: QueryClient,
	chatId: string,
	message: IAppointmentChatMessage,
): void => {
	queryClient.setQueryData<IAppointmentChat | null>(
		appointmentChatQueryKey(chatId),
		(prev) => {
			const messages = prev?.messages ?? []
			if (messages.some((item) => item.id === message.id)) {
				return prev ?? null
			}

			if (!prev) {
				return {
					id: chatId,
					appointmentId: '',
					createdAt: message.createdAt,
					updatedAt: message.updatedAt,
					messages: [message],
				}
			}

			return {
				...prev,
				messages: [...messages, message],
			}
		},
	)
}

export const removeAppointmentChatMessageFromCache = (
	queryClient: QueryClient,
	chatId: string,
	messageId: string,
): void => {
	queryClient.setQueryData<IAppointmentChat | null>(
		appointmentChatQueryKey(chatId),
		(prev) => {
			if (!prev) {
				return prev
			}

			const messages = prev.messages ?? []

			return {
				...prev,
				messages: messages.filter((item) => item.id !== messageId),
			}
		},
	)
}
