import { useMasterSettingsProfile } from '@/components/pages/master-settings/hooks/use-master-settings-profile'
import { MasterServiceCreatePage } from '@/components/pages/master-settings/services/create/master-service-create-page'
import { RouteErrorState } from '@/components/shared/components/route-error-state/route-error-state'
import {
	routeErrorText,
	routeLoadingText,
} from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterServiceCreateScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { t: tMasterSettings } = useScopedTranslation('pages', 'masterSettings')
	const { masterProfile, isLoading, error } = useMasterSettingsProfile()

	if (isLoading || !masterProfile) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>
					{error?.message ? routeErrorText(error.message) : routeLoadingText()}
				</Text>
			</View>
		)
	}

	if (error?.message) {
		return (
			<RouteErrorState
				message={
					error.message
						? routeErrorText(error.message)
						: tMasterSettings('masterProfileNotFound')
				}
				withBackButton
			/>
		)
	}

	return <MasterServiceCreatePage masterProfile={masterProfile} />
}
