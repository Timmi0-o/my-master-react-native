import { recordGetOne } from '@/actions/record/actions'
import { IRecord } from '@/actions/record/models/record.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useRecordGetOne = (recordId: string) => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IRecord>({
		queryKey: ['record', recordId],
		enabled: Boolean(recordId),
		queryFn: async () => {
			const res = await recordGetOne(recordId)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки записи',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data
		},
	})

	return { data, isLoading, error }
}
