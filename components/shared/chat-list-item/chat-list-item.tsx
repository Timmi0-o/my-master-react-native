import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useRouter } from 'expo-router'
import { Avatar, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
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
						.trim() || 'Клиент'
				: 'Клиент'
			: (appointment.masterProfile?.displayName ?? 'Мастер')

	const messages = chat.messages ?? []
	const lastMessage =
		messages.length > 0
			? [...messages].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime(),
				)[0]
			: null

	const preview = lastMessage?.body ?? 'Нет сообщений'
	const timeSource = lastMessage?.createdAt ?? appointment.startsAt
	const timeDate = new Date(timeSource)
	const timeLabel = Number.isNaN(timeDate.getTime())
		? ''
		: timeDate.toLocaleTimeString('ru-RU', {
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
				{appointment.status}
			</Chip>
		</Pressable>
	)
}
