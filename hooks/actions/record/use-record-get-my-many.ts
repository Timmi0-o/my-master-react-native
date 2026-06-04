import { recordGetMyMany } from '@/actions/record/actions'
import { IRecord } from '@/actions/record/models/record.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useRecordGetMyMany = (options?: { enabled?: boolean }) => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IRecord[]>({
		queryKey: ['records', 'my'],
		enabled: options?.enabled ?? true,
		queryFn: async () => {
			const res = await recordGetMyMany()

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки записей',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})

	return { data, isLoading, error }
}
