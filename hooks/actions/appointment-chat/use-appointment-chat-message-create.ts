import {
	appointmentChatMessagesCreate,
	type ICreateAppointmentChatMessagePayload,
} from '@/actions/appointment-chat/actions'
import { scopedT } from '@/configs/i18n/scoped-t'
import { queryCacheUpsertAppointmentChatMessage } from '@/hooks/ws/use-appointment-chat-realtime/helpers/appointment-chat-query-cache'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useAppointmentChatMessageCreate = (chatId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: ICreateAppointmentChatMessagePayload) => {
			const res = await appointmentChatMessagesCreate(payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('sendFailed', 'common', 'toasts.appointmentChat'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data
		},
		onSuccess: async (message) => {
			if (message) {
				queryCacheUpsertAppointmentChatMessage(queryClient, chatId, message)
			}

			await queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
	})
}
