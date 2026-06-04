import { masterScheduleExceptionsGetMany } from '@/actions/master-schedule-exception/actions'
import type { IMasterScheduleException } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterScheduleExceptionGetMany = (
	masterProfileId: string,
	enabled = true,
) => {
	const { toast } = useToast()

	return useQuery<IMasterScheduleException[]>({
		queryKey: ['master-schedule-exceptions', 'many', masterProfileId],
		enabled: enabled && Boolean(masterProfileId),
		queryFn: async () => {
			const res = await masterScheduleExceptionsGetMany({
				filters: {
					preset: 'SHORT',
					page: 1,
					limit: 100,
					orderField: 'startsAt',
					orderDir: 'asc',
					filter: {
						masterProfileId: { value: [masterProfileId], mode: 'AND' },
					},
				},
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadManyFailed', 'common', 'toasts.scheduleException'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})
}
