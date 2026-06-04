import { masterScheduleExceptionsCreate } from '@/actions/master-schedule-exception/actions'
import type { IMasterScheduleExceptionCreatePayload } from '@/actions/master-schedule-exception/models/master-schedule-exception-create-payload.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterScheduleExceptionCreate = (masterProfileId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: IMasterScheduleExceptionCreatePayload) => {
			const res = await masterScheduleExceptionsCreate(payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Не удалось создать исключение',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['master-schedule-exceptions', 'many', masterProfileId],
			})
		},
	})
}
