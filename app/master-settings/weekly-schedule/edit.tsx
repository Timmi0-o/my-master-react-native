import { MasterWeeklyScheduleEditPage } from '@/components/pages/master-settings/master-weekly-schedule-edit-page'
import { useMasterSettingsProfile } from '@/components/pages/master-settings/use-master-settings-profile'
import {
	routeErrorText,
	routeLoadingText,
} from '@/configs/i18n/use-route-feedback'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterWeeklyScheduleEditScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { id } = useLocalSearchParams<{ id?: string }>()
	const scheduleId = Array.isArray(id) ? id[0] : id
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

	return (
		<MasterWeeklyScheduleEditPage
			masterProfile={masterProfile}
			scheduleId={scheduleId}
		/>
	)
}
