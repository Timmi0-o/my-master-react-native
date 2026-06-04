import { masterWeeklySchedulesGetOne } from '@/actions/master-weekly-schedule/actions'
import type { IMasterWeeklySchedule } from '@/actions/master-weekly-schedule/models/master-weekly-schedule.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterWeeklyScheduleGetOne = (id: string, enabled = true) => {
	const { toast } = useToast()

	return useQuery<IMasterWeeklySchedule | null>({
		queryKey: ['master-weekly-schedules', 'one', id],
		enabled: enabled && Boolean(id),
		queryFn: async () => {
			const res = await masterWeeklySchedulesGetOne(id, {
				filters: { preset: 'SHORT' },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки интервала',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? null
		},
	})
}
