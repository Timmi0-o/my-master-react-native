import { masterScheduleExceptionsGetMany } from '@/actions/master-schedule-exception/actions'
import type { IMasterScheduleException } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'
import { useQuery } from '@tanstack/react-query'

export const useMasterScheduleExceptionGetMany = (
	masterProfileId: string,
	enabled = true,
) => {
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

			return res.result?.data ?? []
		},
	})
}
