import { masterServicesGetMy } from '@/actions/master-service/actions'
import type { IMasterServicesGetMyFilters } from '@/actions/master-service/models/master-service-filter.schema'
import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const masterServiceGetMyManyQueryKey = (
	filters?: Partial<IMasterServicesGetMyFilters>,
) => ['master-services', 'my', filters] as const

export const useMasterServiceGetMyMany = (
	filters: Partial<IMasterServicesGetMyFilters> = {},
	options: { enabled?: boolean } = {},
) => {
	const { toast } = useToast()

	const { data, isLoading, error, refetch } = useQuery<IMasterService[]>({
		queryKey: masterServiceGetMyManyQueryKey(filters),
		queryFn: async () => {
			const res = await masterServicesGetMy({
				filters: { preset: 'BASE', page: 1, limit: 20, ...filters },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadMyManyFailed', 'common', 'toasts.masterService'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? []
		},
		enabled: options.enabled ?? true,
	})

	return { data, isLoading, error, refetch }
}
