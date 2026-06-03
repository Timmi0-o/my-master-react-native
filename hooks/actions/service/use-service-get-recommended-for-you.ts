import { masterServicesGetRecommended } from '@/actions/service/actions'
import type { IRecommendedService } from '@/actions/service/models/service.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useServiceGetRecommendedForYou = () => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IRecommendedService[]>({
		queryKey: ['master-services', 'recommended'],
		queryFn: async () => {
			const res = await masterServicesGetRecommended()

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки услуг',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})

	return { data, isLoading, error }
}
