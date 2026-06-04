import type { IAppointmentChatMessage } from '@/actions/appointment-chat/models/appointment-chat-message.schema'
import type { IAppointmentChat } from '@/actions/appointment-chat/models/appointment-chat.schema'
import { API_ROUTES } from '@/constants/api-routes'
import {
	abstractGetAction,
	abstractMutateAction,
} from '@/helpers/action.helper'
import type { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type { IAppointmentChatGetOneFilters } from './models/appointment-chat-filter.schema'

export type ICreateAppointmentChatMessagePayload = {
	chatId: string
	body: string
}

export const appointmentChatsGetOne = async (
	chatId: string,
	options: IGetActionOptions<IAppointmentChatGetOneFilters> = {},
): Promise<IActionResponse<IAppointmentChat>> => {
	return abstractGetAction<IAppointmentChat, IAppointmentChatGetOneFilters>({
		url: API_ROUTES.appointmentChats.one(chatId),
		params: { method: 'GET' },
		...options,
	})
}

export const appointmentChatMessagesCreate = async (
	payload: ICreateAppointmentChatMessagePayload,
): Promise<IActionResponse<IAppointmentChatMessage | null>> => {
	return abstractMutateAction<IAppointmentChatMessage>({
		url: API_ROUTES.appointmentChatMessages.many,
		params: {
			method: 'POST',
			body: payload,
		},
	})
}
