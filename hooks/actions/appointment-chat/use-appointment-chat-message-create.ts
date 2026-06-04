import {
	appointmentChatMessagesCreate,
	type ICreateAppointmentChatMessagePayload,
} from '@/actions/appointment-chat/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
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

			return res.result.data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['appointment-chat', chatId],
			})
			await queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
	})
}
