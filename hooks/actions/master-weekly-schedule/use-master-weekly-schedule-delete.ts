import { masterWeeklySchedulesDelete } from '@/actions/master-weekly-schedule/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterWeeklyScheduleDelete = (masterProfileId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await masterWeeklySchedulesDelete(id)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Не удалось удалить интервал',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['master-weekly-schedules', 'many', masterProfileId],
			})
		},
	})
}
