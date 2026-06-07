import { MasterSettingsHub } from '@/components/pages/master-settings/hub/master-settings-hub'
import { useMasterSettingsProfile } from '@/components/pages/master-settings/hooks/use-master-settings-profile'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import {
	routeErrorText,
	routeLoadingText,
} from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterSettingsIndexScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { masterProfile, isLoading, error } = useMasterSettingsProfile()

	if (isLoading) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>{routeLoadingText()}</Text>
			</View>
		)
	}

	if (error?.message || !masterProfile) {
		return (
			<View
				className='flex-1 bg-background px-4'
				style={{ paddingTop: insets.top }}
			>
				<DataNotFound
					message={
						error?.message
							? routeErrorText(error.message)
							: t('masterProfileNotFound')
					}
				/>
			</View>
		)
	}

	return <MasterSettingsHub masterProfile={masterProfile} />
}
