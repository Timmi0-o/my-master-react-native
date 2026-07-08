import { BasePage } from '@/components/shared/components/base-page/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useRootNavigationState, useRouter } from 'expo-router'
import { Button } from 'heroui-native'
import { useCallback, type ReactElement } from 'react'
import { Text, View } from 'react-native'

export default function NotFoundPage(): ReactElement {
	const { t } = useScopedTranslation('pages', 'not-found.not-found')
	const router = useRouter()
	const rootNavigationState = useRootNavigationState()

	const handleGoToSignIn = useCallback(() => {
		if (!rootNavigationState?.key) {
			return
		}

		router.replace('/(auth)/sign-in')
	}, [rootNavigationState?.key, router])

	return (
		<BasePage contentContainerStyle={{ justifyContent: 'center' }}>
			<View className='items-center gap-4 px-4'>
				<Text className='text-6xl font-bold text-muted'>{t('title')}</Text>
				<Text className='text-center text-2xl font-semibold text-foreground'>
					{t('heading')}
				</Text>
				<Text className='text-center text-base text-muted'>
					{t('description')}
				</Text>
				<Button className='mt-2' onPress={handleGoToSignIn}>
					<Button.Label>{t('goToSignIn')}</Button.Label>
				</Button>
			</View>
		</BasePage>
	)
}
