import type { IAppointmentChatMessage } from '@/actions/appointment-chat/models/appointment-chat-message.schema'
import type { IAppointmentChat } from '@/actions/appointment-chat/models/appointment-chat.schema'
import { BasePage } from '@/components/shared/components/base-page'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
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
import { useKeyboardVisibility } from '@/hooks/use-keyboard-visibility'
import { IconifyIcon } from '@huymobile/react-native-iconify'
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

	const [accentColor, accentForegroundColor, borderColor] = useThemeColor([
		'accent',
		'accent-foreground',
		'border',
	])

	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))

	const [draftMessage, setDraftMessage] = useState('')
	const listRef = useRef<FlatList<IAppointmentChatMessage>>(null)

	const sendMessage = useAppointmentChatMessageCreate(chat.id)

	const currentUserId =
		state.status === 'authenticated'
			? (parseJwt(state.session.accessToken)?.sub ?? '')
			: ''

	const appointment = chat.appointment
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
		const items = chat.messages ?? []

		return [...items].sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		)
	}, [chat.messages])

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
			headerContent={
				<View className='flex-row items-center justify-around px-2'>
					<BackButton withoutLabel />

					<View
						className='flex-row gap-2 justify-between'
						style={{ marginHorizontal: 'auto' }}
					>
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
					className='flex-row items-center gap-2 border-t border-border px-3 pt-2'
					style={{
						borderColor,
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
							<Spinner size='sm' color={accentForegroundColor} />
						) : (
							<IconifyIcon
								name='ion:send'
								size={20}
								color={accentForegroundColor}
							/>
						)}
					</GlassWrapper>
				</View>
			}
		>
			<FlatList
				ref={listRef}
				data={messages}
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
