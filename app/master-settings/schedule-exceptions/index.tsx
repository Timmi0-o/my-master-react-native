import { MasterScheduleExceptionsListPage } from '@/components/pages/master-settings/master-schedule-exceptions-list-page'
import { useMasterSettingsProfile } from '@/components/pages/master-settings/use-master-settings-profile'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterScheduleExceptionsIndexScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { masterProfile, isLoading, error } = useMasterSettingsProfile()

	if (isLoading || !masterProfile) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>
					{error?.message ?? 'Загрузка...'}
				</Text>
			</View>
		)
	}

	return <MasterScheduleExceptionsListPage masterProfile={masterProfile} />
}
