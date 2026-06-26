import { masterServicesGetRecommended } from '@/actions/service/actions'
import type { IMasterServicesGetManyFilters } from '@/actions/master-service/models/master-service-filter.schema'
import type { IRecommendedService } from '@/actions/service/models/service.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const masterServiceGetRecommendedQueryKey = (
	filters?: Partial<IMasterServicesGetManyFilters>,
) => ['master-services', 'recommended', filters] as const

export const useMasterServiceGetRecommended = (
	filters: Partial<IMasterServicesGetManyFilters> = {},
) => {
	const { toast } = useToast()

	const { data, isLoading, error, refetch } = useQuery<IRecommendedService[]>({
		queryKey: masterServiceGetRecommendedQueryKey(filters),
		queryFn: async () => {
			const res = await masterServicesGetRecommended({
				filters: { preset: 'BASE', page: 1, limit: 20, ...filters },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('recommendedFailed', 'common', 'toasts.masterService'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? []
		},
	})

	return { data, isLoading, error, refetch }
}
