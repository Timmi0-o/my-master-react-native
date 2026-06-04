import { MasterScheduleExceptionEditPage } from '@/components/pages/master-settings/master-schedule-exception-edit-page'
import { useMasterSettingsProfile } from '@/components/pages/master-settings/use-master-settings-profile'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterScheduleExceptionEditScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { id } = useLocalSearchParams<{ id?: string }>()
	const exceptionId = Array.isArray(id) ? id[0] : id
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

	return (
		<MasterScheduleExceptionEditPage
			masterProfile={masterProfile}
			exceptionId={exceptionId}
		/>
	)
}
