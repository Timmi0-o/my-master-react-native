import { ChatRoomPage } from '@/components/pages/chat/chat-room-page'
import { useAppointmentChatGetOne } from '@/hooks/actions/appointment-chat/use-appointment-chat-get-one'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChatScreen(): ReactElement {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { chatId } = useLocalSearchParams<{ chatId: string }>()
	const id = Array.isArray(chatId) ? chatId[0] : (chatId ?? '')
	const { data, isLoading, error } = useAppointmentChatGetOne(id)

	if (isLoading) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>Загрузка чата...</Text>
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
					{error?.message ?? 'Чат не найден'}
				</Text>
				<Button variant='outline' onPress={() => router.back()}>
					<Button.Label>Назад</Button.Label>
				</Button>
			</View>
		)
	}

	return <ChatRoomPage chat={data} />
}
