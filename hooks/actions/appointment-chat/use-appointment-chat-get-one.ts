import { appointmentChatsGetOne } from '@/actions/appointment-chat/actions'
import type { IAppointmentChat } from '@/actions/appointment-chat/models/appointment-chat.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useAppointmentChatGetOne = (chatId: string) => {
	const { toast } = useToast()

	return useQuery<IAppointmentChat | null>({
		queryKey: ['appointment-chat', chatId],
		enabled: chatId.length > 0,
		queryFn: async () => {
			const res = await appointmentChatsGetOne(chatId, {
				filters: { preset: 'BASE' },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки чата',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? null
		},
	})
}
