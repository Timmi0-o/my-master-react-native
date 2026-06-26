import { MasterServiceEditPage } from '@/components/pages/master-settings/services/edit/master-service-edit-page'
import { useMasterSettingsProfile } from '@/components/pages/master-settings/hooks/use-master-settings-profile'
import { useMasterServiceGetOne } from '@/hooks/actions/master-service/use-master-service-get-one'
import {
	routeErrorText,
	routeLoadingText,
} from '@/configs/i18n/use-route-feedback'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterServiceEditScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { id } = useLocalSearchParams<{ id?: string }>()
	const serviceId = Array.isArray(id) ? id[0] : id
	const { masterProfile, isLoading: isProfileLoading, error } =
		useMasterSettingsProfile()
	const { data: service, isLoading: isServiceLoading } =
		useMasterServiceGetOne(serviceId ?? '')

	if (isProfileLoading || isServiceLoading || !masterProfile) {
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

	if (!service) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>{routeErrorText('Service not found')}</Text>
			</View>
		)
	}

	return <MasterServiceEditPage service={service} />
}
