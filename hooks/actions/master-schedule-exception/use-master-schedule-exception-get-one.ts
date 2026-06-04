import { masterScheduleExceptionsGetOne } from '@/actions/master-schedule-exception/actions'
import type { IMasterScheduleException } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterScheduleExceptionGetOne = (id: string, enabled = true) => {
	const { toast } = useToast()

	return useQuery<IMasterScheduleException | null>({
		queryKey: ['master-schedule-exceptions', 'one', id],
		enabled: enabled && Boolean(id),
		queryFn: async () => {
			const res = await masterScheduleExceptionsGetOne(id, {
				filters: { preset: 'SHORT' },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки исключения',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? null
		},
	})
}
