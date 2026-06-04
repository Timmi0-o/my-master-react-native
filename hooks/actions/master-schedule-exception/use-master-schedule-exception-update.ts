import { masterScheduleExceptionsUpdate } from '@/actions/master-schedule-exception/actions'
import type { IMasterScheduleExceptionUpdatePayload } from '@/actions/master-schedule-exception/models/master-schedule-exception-update-payload.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterScheduleExceptionUpdate = (masterProfileId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string
			payload: IMasterScheduleExceptionUpdatePayload
		}) => {
			const res = await masterScheduleExceptionsUpdate(id, payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Не удалось обновить исключение',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: ['master-schedule-exceptions', 'many', masterProfileId],
			})
			await queryClient.invalidateQueries({
				queryKey: ['master-schedule-exceptions', 'one', variables.id],
			})
		},
	})
}
