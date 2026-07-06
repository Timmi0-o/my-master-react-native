import { userProfilesGetMe } from '@/actions/user-profile/actions'
import type { IUserProfile } from '@/actions/user-profile/models/user-profile.schema'
import { useAuth } from '@/stores/auth'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useUserProfileGetMine = () => {
	const { toast } = useToast()
	const { isAuthenticated } = useAuth()

	const { data, isLoading, error } = useQuery<IUserProfile | null>({
		queryKey: ['user-profiles', 'me'],
		enabled: isAuthenticated,
		queryFn: async () => {
			const res = await userProfilesGetMe()

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadMineFailed', 'common', 'toasts.userProfile'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? null
		},
	})

	return { data, isLoading, error }
}
