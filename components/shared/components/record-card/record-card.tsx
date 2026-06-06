import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { formatDate, formatTimeByDate } from '@/utils/format-date.util'
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
	const [accentColor, mutedColor] = useThemeColor(['accent', 'muted'])

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

	const formattedDate = formatDate(appointment.startsAt.slice(0, 10))
	const timeLabel = formatTimeByDate(appointment.startsAt)

	return (
		<PressableFeedback onPress={handlePress}>
			<Card className='border border-border' style={style}>
				<Card.Body>
					<View className='gap-3'>
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

						{/* Date and time section */}
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
								<View className='flex-row items-center gap-1'>
									<View className='flex-row items-center gap-1'>
										<Ionicons
											name='calendar-outline'
											size={16}
											color={mutedColor}
										/>
										<Text className='text-sm text-muted'>
											{formattedDate.full}
										</Text>
									</View>
									<View className='flex-row items-center gap-1'>
										<Ionicons
											name='time-outline'
											size={16}
											color={mutedColor}
										/>
										<Text className='text-sm text-muted'>{durationLabel}</Text>
									</View>
								</View>
							</View>

							<Text className='text-base font-bold text-foreground'>
								{priceLabel}
							</Text>
						</View>
					</View>

					{/* Peer section */}
					<View className='flex-row items-center gap-3 border-t border-border mt-2'>
						<Avatar alt={peerTitle} color='accent' size='md'>
							<Avatar.Fallback>{avatarLetter}</Avatar.Fallback>
						</Avatar>

						<View className='flex-1 gap-1'>
							<Text className='text-xs uppercase text-muted'>
								{peerRoleLabel}
							</Text>
							<Text
								className='text-base font-semibold text-foreground'
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
