import { masterWeeklySchedulesUpdate } from '@/actions/master-weekly-schedule/actions'
import type { IMasterWeeklyScheduleUpdatePayload } from '@/actions/master-weekly-schedule/models/master-weekly-schedule-update-payload.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterWeeklyScheduleUpdate = (masterProfileId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string
			payload: IMasterWeeklyScheduleUpdatePayload
		}) => {
			const res = await masterWeeklySchedulesUpdate(id, payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('updateFailed', 'common', 'toasts.weeklySchedule'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: ['master-weekly-schedules', 'many', masterProfileId],
			})
			await queryClient.invalidateQueries({
				queryKey: ['master-weekly-schedules', 'one', variables.id],
			})
		},
	})
}
