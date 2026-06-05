import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { formatDate } from '@/utils/format-date.util'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Chip, useThemeColor, type ChipColor } from 'heroui-native'
import type { ReactElement } from 'react'
import {
	Pressable,
	Text,
	View,
	type StyleProp,
	type ViewStyle,
} from 'react-native'

interface IRecordCardProps {
	appointment: IAppointment
	mode: ActiveProfileMode
	style?: StyleProp<ViewStyle>
	onBeforeNavigate?: () => void
}

function getStatusChipColor(status: IAppointment['status']): ChipColor {
	switch (status) {
		case 'PENDING':
			return 'warning'
		case 'CONFIRMED':
			return 'accent'
		case 'CANCELLED':
		case 'NO_SHOW':
			return 'danger'
		case 'COMPLETED':
			return 'success'
	}
}

interface IRecordPeerSectionProps {
	peerTitle: string
	peerRoleLabel: string
	avatarLetter: string
}

function RecordPeerSection({
	peerTitle,
	peerRoleLabel,
	avatarLetter,
}: IRecordPeerSectionProps): ReactElement {
	return (
		<View className='flex-row items-center gap-3 border-t border-border px-4 py-3'>
			<Avatar alt={peerTitle} color='accent' size='md'>
				<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
			</Avatar>

			<View className='flex-1 gap-1'>
				<Text className='text-xs uppercase text-muted'>{peerRoleLabel}</Text>
				<Text
					className='text-base font-semibold text-foreground'
					ellipsizeMode='tail'
					numberOfLines={1}
				>
					{peerTitle}
				</Text>
			</View>
		</View>
	)
}

export function RecordCard({
	appointment,
	mode,
	style,
	onBeforeNavigate,
}: IRecordCardProps): ReactElement {
	const router = useRouter()
	const { t: tFallback, i18n } = useScopedTranslation('common', 'fallback')
	const { t: tStatus } = useScopedTranslation('common', 'enums.appointmentStatus')
	const { t: tUi } = useScopedTranslation('ui')
	const [accentColor, mutedColor] = useThemeColor(['accent', 'muted'])

	const dateKey = appointment.startsAt.slice(0, 10)
	const formattedDate = formatDate(dateKey)
	const startsAtDate = new Date(appointment.startsAt)
	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))
	const timeLabel = Number.isNaN(startsAtDate.getTime())
		? appointment.startsAt
		: startsAtDate.toLocaleTimeString(dateTimeLocale, {
				hour: '2-digit',
				minute: '2-digit',
			})
	const durationLabel = tUi('durationMinutes', {
		count: appointment.durationMinutes,
	})
	const priceLabel = tUi('priceRub', { price: appointment.totalPrice })

	const isMasterMode = mode === 'master'
	const peerTitle = isMasterMode
		? appointment.clientUser
			? [
					appointment.clientUser.name,
					appointment.clientUser.surname,
					appointment.clientUser.patronymic,
				]
					.filter(Boolean)
					.join(' ')
					.trim() || tFallback('client')
			: tFallback('client')
		: (appointment.masterProfile?.displayName ?? tFallback('master'))

	const peerRoleLabel = isMasterMode
		? tFallback('client')
		: tFallback('master')
	const avatarLetter = peerTitle.trim()[0]?.toUpperCase() ?? '?'

	const handlePress = (): void => {
		onBeforeNavigate?.()
		router.push(`/record/${appointment.id}`)
	}

	return (
		<Pressable
			accessibilityRole='button'
			className='overflow-hidden rounded-2xl border border-border bg-background-secondary active:opacity-80'
			onPress={handlePress}
			style={style}
		>
			<View className='gap-3 p-4'>
				<View className='flex-row items-start justify-between gap-3'>
					<View className='flex-1 gap-2'>
						<Chip
							color={getStatusChipColor(appointment.status)}
							size='sm'
							variant='soft'
						>
							{tStatus(appointment.status)}
						</Chip>
						<Text
							className='text-base font-bold text-foreground'
							numberOfLines={2}
						>
							{appointment.serviceName}
						</Text>
					</View>

					<Ionicons name='chevron-forward' size={18} color={mutedColor} />
				</View>

				<View className='flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3'>
					<View className='items-center px-1'>
						<Text
							className='text-2xl font-bold'
							style={{ color: accentColor }}
						>
							{formattedDate.day}
						</Text>
						<Text
							className='text-xs font-bold uppercase'
							style={{ color: accentColor }}
						>
							{formattedDate.month}
						</Text>
					</View>

					<View className='flex-1 gap-1 border-l border-border pl-3'>
						<Text className='text-base font-semibold text-foreground'>
							{timeLabel}
						</Text>
						<Text className='text-sm text-muted'>{formattedDate.full}</Text>
						<Text className='text-sm text-muted'>{durationLabel}</Text>
					</View>

					<Text className='text-base font-bold text-foreground'>
						{priceLabel}
					</Text>
				</View>
			</View>

			<RecordPeerSection
				avatarLetter={avatarLetter}
				peerRoleLabel={peerRoleLabel}
				peerTitle={peerTitle}
			/>
		</Pressable>
	)
}
