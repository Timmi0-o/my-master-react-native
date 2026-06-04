import { MasterServiceDetail } from '@/components/pages/master-service/master-service-detail/master-service-detail'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceGetOne } from '@/hooks/actions/master-service/use-master-service-get-one'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterServiceScreen(): ReactElement {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { t } = useScopedTranslation('pages', 'masterService')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
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
				className='flex-1 items-center justify-center gap-3 bg-background px-6'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-center text-foreground'>
					{error?.message ? routeErrorText(error.message) : t('notFound')}
				</Text>
				<Button variant='outline' onPress={() => router.back()}>
					<Button.Label>{tBtn('back')}</Button.Label>
				</Button>
			</View>
		)
	}

	return <MasterServiceDetail service={data} />
}
