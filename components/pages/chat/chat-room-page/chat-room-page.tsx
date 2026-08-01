import type { IAppointmentChatMessage } from '@/actions/appointment-chat/models/appointment-chat-message.schema'
import type { IAppointmentChat } from '@/actions/appointment-chat/models/appointment-chat.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useAuth } from '@/stores/auth'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import { formatSystemChatMessage } from '@/helpers/appointment-chat/format-system-chat-message'
import { parseJwt } from '@/helpers/jwt.helper'
import { useAppointmentChatGetOne } from '@/hooks/actions/appointment-chat/use-appointment-chat-get-one'
import { useAppointmentChatMessageCreate } from '@/hooks/actions/appointment-chat/use-appointment-chat-message-create'
import { useKeyboardVisibility } from '@/hooks/use-keyboard-visibility'
import { useAppointmentChatRealtime } from '@/hooks/ws/use-appointment-chat-realtime/use-appointment-chat-realtime'
import { Ionicons } from '@expo/vector-icons'
import { Avatar, Spinner, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CHAT_PEER_TITLE_MAX_LENGTH = 25

function truncatePeerTitle(title: string, maxLength: number): string {
	const trimmed = title.trim()
	if (trimmed.length <= maxLength) {
		return trimmed
	}

	return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`
}

interface IChatRoomPageProps {
	chat: IAppointmentChat
}

export function ChatRoomPage({ chat }: IChatRoomPageProps): ReactElement {
	const insets = useSafeAreaInsets()
	const isKeyboardVisible = useKeyboardVisibility()

	const { mode } = useActiveProfileMode()

	const { state } = useAuth()

	const { resolvedColorScheme } = useThemeApp()
	const backgroundColor = THEME_BACKGROUND_COLORS[resolvedColorScheme]

	const { t: tChat, i18n } = useScopedTranslation('common', 'chat')
	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')
	const { t: tStatus } = useScopedTranslation(
		'common',
		'enums.appointmentStatus',
	)

	const [accentColor, accentForegroundColor, surfaceColor] = useThemeColor([
		'accent',
		'accent-foreground',
		'surface',
	])

	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))

	const [draftMessage, setDraftMessage] = useState('')
	const listRef = useRef<FlatList<IAppointmentChatMessage>>(null)

	const { data: activeChat = chat } = useAppointmentChatGetOne(chat.id)

	const sendMessage = useAppointmentChatMessageCreate(chat.id)

	useAppointmentChatRealtime(chat.id, Boolean(activeChat))

	const currentUserId =
		state.status === 'authenticated'
			? (parseJwt(state.session.accessToken)?.sub ?? '')
			: ''

	const appointment = activeChat?.appointment

	const peerTitleFull =
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

	const peerTitle = truncatePeerTitle(peerTitleFull, CHAT_PEER_TITLE_MAX_LENGTH)

	const headerSubtitle = [
		appointment?.serviceName,
		appointment?.status ? tStatus(appointment.status) : null,
	]
		.filter(Boolean)
		.join(' · ')

	const messages = useMemo(() => {
		const items = activeChat?.messages ?? []

		return [...items].sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		)
	}, [activeChat?.messages])

	const handleSendMessage = useCallback(async () => {
		const body = draftMessage.trim()
		if (!body || sendMessage.isPending) {
			return
		}

		setDraftMessage('')
		await sendMessage.mutateAsync({ chatId: chat.id, body })
	}, [chat.id, draftMessage, sendMessage])

	const avatarLetter = peerTitleFull.trim()[0]?.toUpperCase() ?? '?'

	return (
		<BasePage
			adjustForKeyboard
			isFooterFixed
			isHeaderFixed
			scrollEnabled={false}
			useOverlayChrome
			headerContent={
				<View className='flex-row items-center px-2'>
					<BackButton withoutLabel />

					<View className='min-w-0 flex-1 flex-row items-center justify-center gap-2 px-2'>
						<GlassWrapper
							contentContainerStyle={{
								paddingHorizontal: 12,
								paddingVertical: 8,
							}}
							style={{ borderRadius: 999, minWidth: 0 }}
						>
							<Text
								className='font-semibold text-foreground'
								style={{ fontSize: 14 }}
								numberOfLines={1}
							>
								{peerTitle}
							</Text>
							{headerSubtitle ? (
								<Text
									style={{ fontSize: 10 }}
									className='text-muted'
									numberOfLines={1}
								>
									{headerSubtitle}
								</Text>
							) : null}
						</GlassWrapper>

						<Avatar alt={peerTitleFull} color='accent' size='md'>
							<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
						</Avatar>
					</View>
				</View>
			}
			footerContent={
				<View
					className='flex-row items-center gap-2 px-3 pt-2'
					style={{
						paddingBottom: isKeyboardVisible ? 8 : insets.bottom + 8,
					}}
				>
					<GlassInput
						multiline
						placeholder={tPlaceholder('chatMessage')}
						value={draftMessage}
						onChangeText={setDraftMessage}
						style={{ flex: 1, maxHeight: 120, minHeight: 44 }}
					/>

					<GlassWrapper
						contentContainerStyle={{
							alignItems: 'center',
							height: 44,
							justifyContent: 'center',
							width: 44,
						}}
						isDisabled={!draftMessage.trim() || sendMessage.isPending}
						onPress={() => void handleSendMessage()}
						style={{ borderRadius: 999 }}
						tintColor={accentColor}
					>
						{sendMessage.isPending ? (
							<Spinner size='sm' color={surfaceColor} />
						) : (
							<Ionicons color={surfaceColor} name='send' size={20} />
						)}
					</GlassWrapper>
				</View>
			}
		>
			<FlatList
				ref={listRef}
				data={messages}
				extraData={messages.length}
				keyExtractor={(item) => item.id}
				keyboardDismissMode='interactive'
				keyboardShouldPersistTaps='handled'
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
					const timeDate = new Date(item.createdAt)
					const timeLabel = Number.isNaN(timeDate.getTime())
						? ''
						: timeDate.toLocaleTimeString(dateTimeLocale, {
								hour: '2-digit',
								minute: '2-digit',
							})

					if (item.actor === 'SYSTEM' || item.actor === 'SUPPORT') {
						const systemText = formatSystemChatMessage(item, tChat)
						return (
							<View
								className='w-full items-center px-4 py-1'
								style={{ alignSelf: 'center' }}
							>
								<Text
									className='text-center text-muted'
									style={{ fontSize: 12, lineHeight: 16 }}
								>
									{systemText}
								</Text>
							</View>
						)
					}

					const isMine = item.senderUserId === currentUserId

					return (
						<View
							className='w-fit'
							style={{
								maxWidth: '86%',
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
		</BasePage>
	)
}
