import ProfilePage from '@/components/pages/profile/profile-page'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useMasterProfileGetMine } from '@/hooks/actions/master/use-master-profile-get-mine'
import { useUserProfileGetMine } from '@/hooks/actions/user-profile/use-user-profile-get-mine'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

export default function Profile(): ReactElement {
	const {
		data: clientProfile,
		isLoading: isClientLoading,
		error: clientError,
	} = useUserProfileGetMine()
	const {
		data: masterProfile,
		isLoading: isMasterLoading,
		error: masterError,
	} = useMasterProfileGetMine()

	const error = clientError ?? masterError

	if (error?.message) {
		return <Text>{routeErrorText(error.message)}</Text>
	}

	return (
		<ProfilePage
			clientProfile={clientProfile ?? null}
			masterProfile={masterProfile ?? null}
			isClientLoading={isClientLoading}
			isMasterLoading={isMasterLoading}
		/>
	)
}
