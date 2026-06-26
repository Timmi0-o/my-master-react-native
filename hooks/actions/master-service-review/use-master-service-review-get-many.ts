import { masterServiceReviewsGetMany } from '@/actions/master-service-review/actions'
import type { IMasterServiceReviewsGetManyFilters } from '@/actions/master-service-review/models/master-service-review-filter.schema'
import type { IMasterServiceReview } from '@/actions/master-service-review/models/master-service-review.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const masterServiceReviewGetManyQueryKey = (
	filters?: Partial<IMasterServiceReviewsGetManyFilters>,
) => ['master-service-reviews', 'many', filters] as const

export const useMasterServiceReviewGetMany = (
	filters: Partial<IMasterServiceReviewsGetManyFilters> = {},
	options: { enabled?: boolean } = {},
) => {
	const { toast } = useToast()

	const { data, isLoading, error, refetch } = useQuery<IMasterServiceReview[]>({
		queryKey: masterServiceReviewGetManyQueryKey(filters),
		enabled: options.enabled ?? true,
		queryFn: async () => {
			const res = await masterServiceReviewsGetMany({
				filters: { preset: 'BASE', page: 1, limit: 20, ...filters },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadManyFailed', 'common', 'toasts.masterServiceReview'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? []
		},
	})

	return { data, isLoading, error, refetch }
}
