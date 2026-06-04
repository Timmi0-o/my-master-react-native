import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type { IUserProfile } from '@/actions/user-profile/models/user-profile.schema'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useMasterProfileGetMine } from '@/hooks/actions/master/use-master-profile-get-mine'
import { useUserProfileGetMine } from '@/hooks/actions/user-profile/use-user-profile-get-mine'

type ActiveProfileData = IUserProfile | IMasterProfile | null

export const useActiveProfileGetMine = () => {
	const { mode } = useActiveProfileMode()
	const userProfileQuery = useUserProfileGetMine()
	const masterProfileQuery = useMasterProfileGetMine()

	if (mode === 'master') {
		return {
			mode,
			data: masterProfileQuery.data as ActiveProfileData,
			isLoading: masterProfileQuery.isLoading,
			error: masterProfileQuery.error,
		}
	}

	return {
		mode,
		data: userProfileQuery.data as ActiveProfileData,
		isLoading: userProfileQuery.isLoading,
		error: userProfileQuery.error,
	}
}
