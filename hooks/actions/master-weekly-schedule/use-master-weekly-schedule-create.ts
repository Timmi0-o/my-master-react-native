import { masterWeeklySchedulesCreate } from '@/actions/master-weekly-schedule/actions'
import type { IMasterWeeklyScheduleCreatePayload } from '@/actions/master-weekly-schedule/models/master-weekly-schedule-create-payload.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterWeeklyScheduleCreate = (masterProfileId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: IMasterWeeklyScheduleCreatePayload) => {
			const res = await masterWeeklySchedulesCreate(payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('createFailed', 'common', 'toasts.weeklySchedule'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['master-weekly-schedules', 'many', masterProfileId],
			})
		},
	})
}
