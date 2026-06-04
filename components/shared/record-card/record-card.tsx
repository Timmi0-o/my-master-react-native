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
import { Chip, useThemeColor } from 'heroui-native'
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

export function RecordCard({
	appointment,
	mode,
	style,
	onBeforeNavigate,
}: IRecordCardProps): ReactElement {
	const router = useRouter()
	const { t: tFallback, i18n } = useScopedTranslation('common', 'fallback')
	const { t } = useScopedTranslation('common', 'enums.appointmentStatus')
	const [accentColor, accentForegroundColor, mutedColor] = useThemeColor([
		'accent',
		'accent-foreground',
		'muted',
	])

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
						.trim() || tFallback('client')
				: tFallback('client')
			: (appointment.masterProfile?.displayName ?? tFallback('master'))

	const handlePress = (): void => {
		onBeforeNavigate?.()
		router.push(`/record/${appointment.id}`)
	}

	return (
		<Pressable
			accessibilityRole='button'
			className='rounded-2xl border border-border bg-background-secondary p-4 active:opacity-80'
			onPress={handlePress}
			style={style}
		>
			<View className='flex-row items-start gap-3'>
				<View
					className='items-center justify-center rounded-2xl px-3 py-2'
					style={{ backgroundColor: accentColor }}
				>
					<Text
						className='text-lg font-bold'
						style={{ color: accentForegroundColor }}
					>
						{formattedDate.day}
					</Text>
					<Text
						className='text-xs font-semibold'
						style={{ color: accentForegroundColor }}
					>
						{formattedDate.month}
					</Text>
				</View>

				<View className='flex-1 gap-2'>
					<View className='flex-row items-start justify-between gap-3'>
						<View className='flex-1'>
							<Text className='text-base font-semibold text-foreground'>
								{appointment.serviceName}
							</Text>
							<View className='mt-1 flex-row items-center gap-1.5'>
								<Ionicons name='time-outline' size={16} color={mutedColor} />
								<Text className='text-sm text-muted'>{timeLabel}</Text>
							</View>
						</View>

						<Chip variant='soft' color='accent'>
							{t(appointment.status)}
						</Chip>
					</View>

					<View className='flex-row items-center gap-2 rounded-xl bg-surface px-3 py-2'>
						<Ionicons name='person-outline' size={16} color={mutedColor} />
						<Text className='flex-1 text-sm text-foreground'>
							{peerTitle}
						</Text>
					</View>

					<View className='flex-row items-center gap-2 rounded-xl bg-surface px-3 py-2'>
						<Ionicons name='calendar-outline' size={16} color={mutedColor} />
						<Text className='text-sm text-foreground'>
							{formattedDate.full}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	)
}
