import { userProfilesGetOne } from '@/actions/user-profile/actions'
import type { IUserProfile } from '@/actions/user-profile/models/user-profile.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const userProfileGetOneQueryKey = (id: string) =>
	['user-profiles', 'one', id] as const

export const useUserProfileGetOne = (id: string) => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IUserProfile | null>({
		queryKey: userProfileGetOneQueryKey(id),
		queryFn: async () => {
			const res = await userProfilesGetOne(id)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadOneFailed', 'common', 'toasts.userProfile'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? null
		},
		enabled: Boolean(id),
	})

	return { data, isLoading, error }
}
