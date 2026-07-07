import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { getStatusChipColor } from '@/components/shared/components/record-card/data/get-status-color'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { formatTimeByDate } from '@/utils/format-date.util'
import { useRouter } from 'expo-router'
import { Avatar, Chip } from 'heroui-native'
import { Pressable, Text, View } from 'react-native'

interface IChatListItemProps {
	appointment: IAppointment
	isLast?: boolean
	mode: ActiveProfileMode
}

export function ChatListItem({
	appointment,
	isLast = false,
	mode,
}: IChatListItemProps) {
	const router = useRouter()

	const { t } = useScopedTranslation('common', 'chat')
	const { t: tStatus } = useScopedTranslation(
		'common',
		'enums.appointmentStatus',
	)

	const chat = appointment.chat

	if (!chat) {
		return null
	}

	const peerTitle =
		mode === 'master'
			? appointment.clientUser
				? [
						appointment.clientUser.name,
						appointment.clientUser.surname,
						appointment.clientUser.patronymic,
					]
						.filter(Boolean)
						.join(' ')
						.trim() || t('clientFallback')
				: t('clientFallback')
			: (appointment.masterProfile?.displayName ?? t('masterFallback'))

	const messages = chat.messages ?? []

	const lastMessage =
		messages.length > 0
			? [...messages].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				)[0]
			: null

	const chatPreview = lastMessage?.body ?? t('noMessages')

	const timeLabel = formatTimeByDate(
		lastMessage?.createdAt ?? appointment.startsAt,
	)

	const avatarLetter = peerTitle.trim()[0]?.toUpperCase() ?? '?'

	return (
		<Pressable
			accessibilityRole='button'
			className={`flex-row items-center gap-3 bg-surface px-4 py-3 active:opacity-80 ${
				isLast ? '' : 'border-b border-border'
			}`}
			onPress={() => router.push(`/chat/${chat.id}`)}
		>
			<Avatar alt={peerTitle} color='accent' size='lg'>
				<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
			</Avatar>

			<View className='flex-1 gap-1'>
				<View className='flex-row items-start justify-between gap-2'>
					<Text
						className='flex-1 text-base font-semibold text-foreground'
						ellipsizeMode='tail'
						numberOfLines={1}
					>
						{peerTitle}
					</Text>

					<View style={{ alignItems: 'flex-end', gap: 4 }}>
						<Text className='text-xs text-muted'>{timeLabel}</Text>
						<Chip
							color={getStatusChipColor(appointment.status)}
							size='sm'
							variant='soft'
						>
							{tStatus(appointment.status)}
						</Chip>
					</View>
				</View>

				<Text
					className='text-sm text-muted'
					ellipsizeMode='tail'
					numberOfLines={1}
				>
					{appointment.serviceName} · {chatPreview}
				</Text>
			</View>
		</Pressable>
	)
}
