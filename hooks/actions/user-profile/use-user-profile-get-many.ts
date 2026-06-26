import { userProfilesGetMany } from '@/actions/user-profile/actions'
import type { IUserProfilesGetManyFilters } from '@/actions/user-profile/models/user-profile-filter.schema'
import type { IUserProfile } from '@/actions/user-profile/models/user-profile.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const userProfileGetManyQueryKey = (
	filters?: Partial<IUserProfilesGetManyFilters>,
) => ['user-profiles', 'many', filters] as const

export const useUserProfileGetMany = (
	filters: Partial<IUserProfilesGetManyFilters> = {},
) => {
	const { toast } = useToast()

	const { data, isLoading, error, refetch } = useQuery<IUserProfile[]>({
		queryKey: userProfileGetManyQueryKey(filters),
		queryFn: async () => {
			const res = await userProfilesGetMany({
				filters: { preset: 'BASE', page: 1, limit: 20, ...filters },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadManyFailed', 'common', 'toasts.userProfile'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? []
		},
	})

	return { data, isLoading, error, refetch }
}
