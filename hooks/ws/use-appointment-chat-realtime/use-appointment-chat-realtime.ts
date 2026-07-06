import {
	AppointmentChatWsAckErrorSchema,
	AppointmentChatWsMessageCreatedPayloadSchema,
	AppointmentChatWsMessageDeletedPayloadSchema,
} from '@/actions/appointment-chat/models/ws/appointment-chat-ws-payload.schema'
import { authStore } from '@/stores/auth'
import { APPOINTMENT_CHAT_WS_EVENTS } from '@/constants/appointment-chat-ws.events'
import {
	queryCacheRemoveAppointmentChatMessage,
	queryCacheUpsertAppointmentChatMessage,
} from '@/hooks/ws/use-appointment-chat-realtime/helpers/appointment-chat-query-cache'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'

type JoinAckResponse =
	| { result: { data: { joined: true } } }
	| { error: { statusCode: number; message: string } }

export const useAppointmentChatRealtime = (
	chatId: string,
	enabled = true,
): void => {
	const queryClient = useQueryClient()
	const socketRef = useRef<Socket | null>(null)

	useEffect(() => {
		if (!enabled || chatId.length === 0) {
			return
		}

		let disposed = false

		const connect = async (): Promise<void> => {
			const token = await authStore.getAccessToken()

			if (!token || disposed) {
				return
			}

			const socket = io(buildAppointmentChatWsUrl(), {
				auth: { token },
				autoConnect: true,
			})

			socketRef.current = socket

			const joinRoom = (): void => {
				socket.emit(
					APPOINTMENT_CHAT_WS_EVENTS.JOIN,
					{ chatId },
					(ack: JoinAckResponse | undefined) => {
						if (!ack) {
							return
						}

						const errorResult = AppointmentChatWsAckErrorSchema.safeParse(ack)

						if (errorResult.success) {
							console.warn(
								'[appointment-chat-ws] join failed:',
								errorResult.data.error.message,
							)
						}
					},
				)
			}

			socket.on('connect', joinRoom)

			if (socket.connected) {
				joinRoom()
			}

			socket.on('connect_error', (error: Error) => {
				console.warn('[appointment-chat-ws] connect_error:', error.message)
			})

			socket.on(
				APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_CREATED,
				(payload: unknown) => {
					const parsed =
						AppointmentChatWsMessageCreatedPayloadSchema.safeParse(payload)
					if (!parsed.success) {
						console.warn(
							'[appointment-chat-ws] invalid message.created payload',
						)
						return
					}

					queryCacheUpsertAppointmentChatMessage(
						queryClient,
						chatId,
						parsed.data.result.data,
					)
				},
			)

			socket.on(
				APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_DELETED,
				(payload: unknown) => {
					const parsed =
						AppointmentChatWsMessageDeletedPayloadSchema.safeParse(payload)
					if (!parsed.success) {
						console.warn(
							'[appointment-chat-ws] invalid message.deleted payload',
						)
						return
					}

					queryCacheRemoveAppointmentChatMessage(
						queryClient,
						chatId,
						parsed.data.result.data.messageId,
					)
				},
			)
		}

		void connect()

		return () => {
			disposed = true
			const socket = socketRef.current
			if (socket?.connected) {
				socket.emit(APPOINTMENT_CHAT_WS_EVENTS.LEAVE, { chatId })
			}
			socket?.removeAllListeners()
			socket?.disconnect()
			socketRef.current = null
		}
	}, [chatId, enabled, queryClient])
}

const buildAppointmentChatWsUrl = (): string => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL
	if (!apiUrl) {
		throw new Error('EXPO_PUBLIC_API_URL is required')
	}

	const origin = apiUrl.replace(/\/v1\/?$/, '')
	return `${origin}/v1/appointment-chats`
}
