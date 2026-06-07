import { MasterServiceDetail } from '@/components/pages/master-service/master-service-detail/master-service-detail'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceGetOne } from '@/hooks/actions/master-service/use-master-service-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterServiceScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { t } = useScopedTranslation('pages', 'masterService')
	const { id } = useLocalSearchParams<{ id: string }>()
	const masterServiceId = Array.isArray(id) ? id[0] : (id ?? '')
	const { data, isLoading, error } = useMasterServiceGetOne(masterServiceId)

	if (isLoading) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>{t('loading')}</Text>
			</View>
		)
	}

	if (error?.message || !data) {
		return (
			<View
				className='flex-1 bg-background px-4'
				style={{ paddingTop: insets.top + 8 }}
			>
				<BackButton />
				<View className='flex-1'>
					<DataNotFound
						message={
							error?.message ? routeErrorText(error.message) : t('notFound')
						}
					/>
				</View>
			</View>
		)
	}

	return <MasterServiceDetail service={data} />
}
