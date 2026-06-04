import { MasterSettingsHub } from '@/components/pages/master-settings/master-settings-hub'
import { useMasterSettingsProfile } from '@/components/pages/master-settings/use-master-settings-profile'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterSettingsIndexScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { masterProfile, isLoading, error } = useMasterSettingsProfile()

	if (isLoading) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>Загрузка...</Text>
			</View>
		)
	}

	if (error?.message || !masterProfile) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background px-6'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-center text-foreground'>
					{error?.message ?? 'Профиль мастера не найден'}
				</Text>
			</View>
		)
	}

	return <MasterSettingsHub masterProfile={masterProfile} />
}
