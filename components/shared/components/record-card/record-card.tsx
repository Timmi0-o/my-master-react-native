import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { formatTimeByDate } from '@/utils/format-date.util'
import {
	ECurrency,
	formatPriceByCurrency,
} from '@/utils/format-price-by-currency'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
	Avatar,
	Card,
	Chip,
	PressableFeedback,
	useThemeColor,
} from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { getStatusChipColor } from './data/get-status-color'

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

	const { t: tFallback } = useScopedTranslation('common', 'fallback')
	const { t: tStatus } = useScopedTranslation(
		'common',
		'enums.appointmentStatus',
	)

	const { t: tUi } = useScopedTranslation('ui')
	const mutedColor = useThemeColor('muted')

	const durationLabel = tUi('durationMinutes', {
		count: appointment.durationMinutes,
	})
	const priceLabel = formatPriceByCurrency(
		appointment.totalPrice,
		ECurrency.RUB,
	)

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

	const peerRoleLabel = isMasterMode ? tFallback('client') : tFallback('master')

	const avatarLetter = peerTitle.trim()[0]?.toUpperCase() ?? '?'

	const handlePress = (): void => {
		onBeforeNavigate?.()
		router.push(`/record/${appointment.id}`)
	}

	const timeLabel = formatTimeByDate(appointment.startsAt)

	return (
		<PressableFeedback onPress={handlePress}>
			<Card className='bg-surface border border-border' style={style}>
				<Card.Body className='gap-3'>
					<View className='flex-row justify-between items-start gap-3'>
						<View className='flex-row flex-1 justify-between items-center gap-2'>
							<Text
								className='font-bold text-foreground text-base'
								numberOfLines={1}
							>
								{appointment.serviceName}
							</Text>
							<Chip
								color={getStatusChipColor(appointment.status)}
								size='sm'
								variant='soft'
							>
								{tStatus(appointment.status)}
							</Chip>
						</View>

						<Ionicons name='chevron-forward' size={18} color={mutedColor} />
					</View>

					<View className='flex-row justify-between items-center bg-background-secondary px-3 py-2 rounded-xl'>
						<View className='flex-row items-center gap-2'>
							<Text className='font-bold text-foreground text-lg'>
								{timeLabel}
							</Text>
							<Text className='text-muted text-sm'>{durationLabel}</Text>
						</View>

						<Text className='font-semibold text-foreground text-base'>
							{priceLabel}
						</Text>
					</View>

					<View className='flex-row items-center gap-3'>
						<Avatar alt={peerTitle} color='accent' size='sm'>
							<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
						</Avatar>

						<View className='flex-1 gap-0.5'>
							<Text className='text-muted text-xs uppercase'>
								{peerRoleLabel}
							</Text>
							<Text
								className='font-semibold text-foreground text-base'
								ellipsizeMode='tail'
								numberOfLines={1}
							>
								{peerTitle}
							</Text>
						</View>
					</View>
				</Card.Body>
			</Card>
		</PressableFeedback>
	)
}
