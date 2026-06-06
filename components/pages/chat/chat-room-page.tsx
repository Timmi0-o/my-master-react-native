import type { IAppointmentChatMessage } from '@/actions/appointment-chat/models/appointment-chat-message.schema'
import type { IAppointmentChat } from '@/actions/appointment-chat/models/appointment-chat.schema'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
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
import { IconifyIcon } from '@huymobile/react-native-iconify'
import { GlassView } from 'expo-glass-effect'
import { Avatar, Spinner, useThemeColor } from 'heroui-native'
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

	const [draft, setDraft] = useState('')
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

	const handleSend = useCallback(async () => {
		const body = draft.trim()
		if (!body || sendMessage.isPending) {
			return
		}

		setDraft('')
		await sendMessage.mutateAsync({ chatId: chat.id, body })
	}, [chat.id, draft, sendMessage])

	const avatarLetter = peerTitleFull.trim()[0]?.toUpperCase() ?? '?'

	return (
		<KeyboardAvoidingView
			className='flex-1'
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ backgroundColor, flex: 1 }}
		>
			<View
				className='flex-row items-center justify-around px-2'
				style={{ paddingTop: insets.top + 8 }}
			>
				<BackButton withoutLabel style={{ marginTop: 4 }} />

				<View className='flex-row gap-2' style={{ marginHorizontal: 'auto' }}>
					<Avatar alt={peerTitleFull} color='accent' size='md'>
						<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
					</Avatar>

					<GlassView
						isInteractive
						glassEffectStyle='regular'
						style={{
							minWidth: 0,
							borderRadius: 16,
							overflow: 'hidden',
							paddingHorizontal: 12,
							paddingVertical: 8,
						}}
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
					</GlassView>
				</View>
			</View>

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
				className='flex-row items-end gap-2 border-t border-border px-3 pt-2'
				style={{
					borderColor,
					paddingBottom: insets.bottom + 8,
				}}
			>
				<GlassInput
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
						<IconifyIcon
							name='ion:send'
							size={20}
							color={accentForegroundColor}
						/>
					)}
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	)
}
