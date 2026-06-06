import { ChatRoomPage } from '@/components/pages/chat/chat-room-page'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useAppointmentChatGetOne } from '@/hooks/actions/appointment-chat/use-appointment-chat-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChatScreen(): ReactElement {
	const insets = useSafeAreaInsets()
	const { t } = useScopedTranslation('pages', 'routes')
	const { chatId } = useLocalSearchParams<{ chatId: string }>()
	const id = Array.isArray(chatId) ? chatId[0] : (chatId ?? '')
	const { data, isLoading, error } = useAppointmentChatGetOne(id)

	if (isLoading) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>{t('loadingChat')}</Text>
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
						{error?.message ? routeErrorText(error.message) : t('chatNotFound')}
					</Text>
				</View>
			</View>
		)
	}

	return <ChatRoomPage chat={data} />
}
