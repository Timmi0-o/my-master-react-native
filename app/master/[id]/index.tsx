import { MasterDetail } from '@/components/pages/master/master-detail/master-detail'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterProfileGetOne } from '@/hooks/actions/master/use-master-profile-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterProfileScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { t } = useScopedTranslation('pages', 'master')
	const { id } = useLocalSearchParams<{ id: string }>()
	const masterProfileId = Array.isArray(id) ? id[0] : (id ?? '')
	const { data, isLoading, error } = useMasterProfileGetOne(masterProfileId)

	if (isLoading) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>{t('loadingProfile')}</Text>
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
				<View className='flex-1 items-center justify-center gap-3 px-2'>
					<Text className='text-center text-foreground'>
						{error?.message
							? routeErrorText(error.message)
							: t('profileNotFound')}
					</Text>
				</View>
			</View>
		)
	}

	return <MasterDetail master={data} />
}
