import { masterScheduleExceptionsDelete } from '@/actions/master-schedule-exception/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterScheduleExceptionDelete = (masterProfileId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await masterScheduleExceptionsDelete(id)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Не удалось удалить исключение',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['master-schedule-exceptions', 'many', masterProfileId],
			})
		},
	})
}
