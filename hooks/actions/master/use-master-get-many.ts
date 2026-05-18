import { masterGetMany } from '@/actions/master/actions'
import { IMaster } from '@/actions/master/models/master.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterGetMany = () => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IMaster[]>({
		queryKey: ['masters', 'many'],
		queryFn: async () => {
			const res = await masterGetMany()

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки мастеров',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data
		},
	})

	return { data, isLoading, error }
}
