import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { useRouter } from 'expo-router'
import { Avatar, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Pressable, Text, View } from 'react-native'

interface IChatListItemProps {
	appointment: IAppointment
	mode: ActiveProfileMode
}

export function ChatListItem({
	appointment,
	mode,
}: IChatListItemProps): ReactElement | null {
	const router = useRouter()
	const { t, i18n } = useScopedTranslation('common', 'chat')
	const { t: tStatus } = useScopedTranslation('common', 'enums.appointmentStatus')
	const chat = appointment.chat
	if (!chat) {
		return null
	}

	const peerTitle =
		mode === 'master'
			? appointment.clientUser
				? [appointment.clientUser.name, appointment.clientUser.surname, appointment.clientUser.patronymic]
						.filter(Boolean)
						.join(' ')
						.trim() || t('clientFallback')
				: t('clientFallback')
			: (appointment.masterProfile?.displayName ??
				t('masterFallback'))

	const messages = chat.messages ?? []
	const lastMessage =
		messages.length > 0
			? [...messages].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime(),
				)[0]
			: null

	const preview = lastMessage?.body ?? t('noMessages')
	const timeSource = lastMessage?.createdAt ?? appointment.startsAt
	const timeDate = new Date(timeSource)
	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))
	const timeLabel = Number.isNaN(timeDate.getTime())
		? ''
		: timeDate.toLocaleTimeString(dateTimeLocale, {
				hour: '2-digit',
				minute: '2-digit',
			})
	const avatarLetter = peerTitle.trim()[0]?.toUpperCase() ?? '?'

	return (
		<Pressable
			accessibilityRole='button'
			className='flex-row items-center gap-3 rounded-2xl bg-surface px-3 py-3 active:opacity-80'
			onPress={() => router.push(`/chat/${chat.id}`)}
		>
			<Avatar alt={peerTitle} color='accent'>
				<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
			</Avatar>

			<View className='min-w-0 flex-1 gap-1'>
				<View className='flex-row items-center justify-between gap-2'>
					<Text
						className='flex-1 text-base font-semibold text-foreground'
						numberOfLines={1}
					>
						{peerTitle}
					</Text>
					<Text className='text-xs text-muted'>{timeLabel}</Text>
				</View>

				<Text className='text-sm text-muted' numberOfLines={1}>
					{appointment.serviceName}
				</Text>

				<Text className='text-sm text-foreground' numberOfLines={2}>
					{preview}
				</Text>
			</View>

			<Chip variant='soft' color='default'>
				{tStatus(appointment.status)}
			</Chip>
		</Pressable>
	)
}
