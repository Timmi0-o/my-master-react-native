import { serviceGetRecommendedForYou } from '@/actions/service/actions'
import { IRecommendedService } from '@/actions/service/models/service.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useServiceGetRecommendedForYou = () => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IRecommendedService[]>({
		queryKey: ['services', 'recommended-for-you'],
		queryFn: async () => {
			const res = await serviceGetRecommendedForYou()

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки услуг',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data
		},
	})

	return { data, isLoading, error }
}
