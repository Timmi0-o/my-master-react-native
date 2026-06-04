import { masterWeeklySchedulesGetMany } from '@/actions/master-weekly-schedule/actions'
import type { IMasterWeeklySchedule } from '@/actions/master-weekly-schedule/models/master-weekly-schedule.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterWeeklyScheduleGetMany = (
	masterProfileId: string,
	enabled = true,
) => {
	const { toast } = useToast()

	return useQuery<IMasterWeeklySchedule[]>({
		queryKey: ['master-weekly-schedules', 'many', masterProfileId],
		enabled: enabled && Boolean(masterProfileId),
		queryFn: async () => {
			const res = await masterWeeklySchedulesGetMany({
				filters: {
					preset: 'SHORT',
					page: 1,
					limit: 100,
					orderField: 'dayOfWeek',
					orderDir: 'asc',
					filter: {
						masterProfileId: { value: [masterProfileId], mode: 'AND' },
					},
				},
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки расписания',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})
}
