import type { IAppointmentChatMessage } from '@/actions/appointment-chat/models/appointment-chat-message.schema'
import type { IAppointmentChat } from '@/actions/appointment-chat/models/appointment-chat.schema'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useAuth } from '@/configs/auth/auth-context'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import { parseJwt } from '@/helpers/jwt.helper'
import { useAppointmentChatMessageCreate } from '@/hooks/actions/appointment-chat/use-appointment-chat-message-create'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
	Avatar,
	Button,
	InputGroup,
	Separator,
	Spinner,
	useThemeColor,
} from 'heroui-native'
import type { ReactElement } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface IChatRoomPageProps {
	chat: IAppointmentChat
}

export function ChatRoomPage({ chat }: IChatRoomPageProps): ReactElement {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { mode } = useActiveProfileMode()
	const { state } = useAuth()
	const { resolvedColorScheme } = useThemeApp()
	const backgroundColor = THEME_BACKGROUND_COLORS[resolvedColorScheme]
	const { t: tChat, i18n } = useScopedTranslation('common', 'chat')
	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')
	const [accentColor, accentForegroundColor, mutedColor, borderColor] =
		useThemeColor(['accent', 'accent-foreground', 'muted', 'border'])
	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))

	const [draft, setDraft] = useState('')
	const listRef = useRef<FlatList<IAppointmentChatMessage>>(null)
	const sendMessage = useAppointmentChatMessageCreate(chat.id)

	const currentUserId =
		state.status === 'authenticated'
			? (parseJwt(state.session.accessToken)?.sub ?? '')
			: ''

	const appointment = chat.appointment
	const peerTitle =
		mode === 'master'
			? appointment?.clientUser
				? [
						appointment.clientUser.name,
						appointment.clientUser.surname,
						appointment.clientUser.patronymic,
					]
						.filter(Boolean)
						.join(' ')
						.trim() || tChat('clientFallback')
				: tChat('clientFallback')
			: (appointment?.masterProfile?.displayName ?? tChat('masterFallback'))

	const headerSubtitle = [appointment?.serviceName, appointment?.status]
		.filter(Boolean)
		.join(' · ')

	const messages = useMemo(() => {
		const items = chat.messages ?? []

		return [...items].sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		)
	}, [chat.messages])

	const handleSend = useCallback(async () => {
		const body = draft.trim()
		if (!body || sendMessage.isPending) {
			return
		}

		setDraft('')
		await sendMessage.mutateAsync({ chatId: chat.id, body })
	}, [chat.id, draft, sendMessage])

	const avatarLetter = peerTitle.trim()[0]?.toUpperCase() ?? '?'

	return (
		<KeyboardAvoidingView
			className='flex-1'
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ backgroundColor, flex: 1 }}
		>
			<View
				className='flex-row items-center gap-3 bg-background px-2'
				style={{ paddingTop: insets.top + 4, borderColor }}
			>
				<Button
					isIconOnly
					size='sm'
					variant='ghost'
					onPress={() => router.back()}
				>
					<Ionicons name='chevron-back' size={24} color={mutedColor} />
				</Button>

				<Avatar alt={peerTitle} color='accent' size='sm'>
					<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
				</Avatar>

				<View className='min-w-0 flex-1'>
					<Text
						className='text-base font-semibold text-foreground'
						numberOfLines={1}
					>
						{peerTitle}
					</Text>
					{headerSubtitle ? (
						<Text className='text-xs text-muted' numberOfLines={1}>
							{headerSubtitle}
						</Text>
					) : null}
				</View>
			</View>

			<Separator className='my-2' />

			<FlatList
				ref={listRef}
				data={messages}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					flexGrow: 1,
					gap: 8,
					justifyContent: messages.length ? 'flex-end' : 'center',
					paddingHorizontal: 12,
					paddingVertical: 12,
				}}
				style={{ flex: 1, backgroundColor }}
				onContentSizeChange={() => {
					if (messages.length > 0) {
						listRef.current?.scrollToEnd({ animated: false })
					}
				}}
				ListEmptyComponent={
					<Text className='text-center text-sm text-muted'>
						{tChat('firstMessage')}
					</Text>
				}
				renderItem={({ item }) => {
					const isMine = item.senderUserId === currentUserId
					const timeDate = new Date(item.createdAt)
					const timeLabel = Number.isNaN(timeDate.getTime())
						? ''
						: timeDate.toLocaleTimeString(dateTimeLocale, {
								hour: '2-digit',
								minute: '2-digit',
							})

					return (
						<View
							className={`w-fit`}
							style={{
								maxWidth: '72%',
								alignSelf: isMine ? 'flex-end' : 'flex-start',
							}}
						>
							<View
								className={`rounded-2xl px-3 py-2 ${isMine ? '' : 'bg-surface'}`}
								style={isMine ? { backgroundColor: accentColor } : undefined}
							>
								<Text
									className={`text-base ${isMine ? '' : 'text-foreground'}`}
									style={isMine ? { color: accentForegroundColor } : undefined}
								>
									{item.body}
								</Text>
							</View>
							<Text
								className={`mt-1 text-muted ${isMine ? 'text-right' : 'text-left'}`}
								style={{ fontSize: 11, marginTop: 2 }}
							>
								{timeLabel}
							</Text>
						</View>
					)
				}}
			/>

			<View
				className='flex-row items-end gap-2 border-t border-border bg-background px-3 pt-2'
				style={{
					borderColor,
					paddingBottom: insets.bottom + 8,
				}}
			>
				<InputGroup.Input
					multiline
					placeholder={tPlaceholder('chatMessage')}
					value={draft}
					onChangeText={setDraft}
					style={{ flex: 1, minHeight: 40 }}
				/>

				<Pressable
					accessibilityRole='button'
					className='mb-1 h-11 w-11 items-center justify-center rounded-full active:opacity-80'
					style={{ backgroundColor: accentColor }}
					disabled={!draft.trim() || sendMessage.isPending}
					onPress={() => void handleSend()}
				>
					{sendMessage.isPending ? (
						<Spinner size='sm' color={accentForegroundColor} />
					) : (
						<Ionicons name='send' size={20} color={accentForegroundColor} />
					)}
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	)
}
