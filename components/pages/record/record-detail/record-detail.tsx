import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import {
	formatDate,
	FormatDateTime,
	formatTimeByDate,
} from '@/utils/format-date.util'
import {
	ECurrency,
	formatPriceByCurrency,
} from '@/utils/format-price-by-currency'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Button, Card, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface IRecordDetailProps {
	appointment: IAppointment
	mode: ActiveProfileMode
}

export default function RecordDetail({
	appointment,
	mode,
}: IRecordDetailProps): ReactElement {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { t } = useScopedTranslation('pages', 'record')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { t: tUi } = useScopedTranslation('ui')
	const { t: tFallback } = useScopedTranslation('common', 'fallback')

	const cancelledByLabel = useEnumLabel('enums.cancelledBy')

	const { t: tStatus } = useScopedTranslation(
		'common',
		'enums.appointmentStatus',
	)

	const [mutedColor, accentForegroundColor] = useThemeColor([
		'muted',
		'accent-foreground',
	])

	const formattedDate = formatDate(appointment.startsAt.slice(0, 10))
	const timeLabel = formatTimeByDate(appointment.startsAt)

	const isMasterMode = mode === 'master'
	const clientUser = appointment.clientUser
	const masterProfile = appointment.masterProfile
	const masterService = appointment.masterService
	const chatId = appointment.chat?.id
	const hasChat = Boolean(chatId)

	const peerTitle = isMasterMode
		? clientUser
			? [clientUser.name, clientUser.surname, clientUser.patronymic]
					.filter(Boolean)
					.join(' ')
					.trim() || tFallback('client')
			: tFallback('client')
		: (masterProfile?.displayName ?? tFallback('master'))

	const peerSectionTitle = isMasterMode
		? t('peerSectionClient')
		: t('peerSectionMaster')

	const isCancelled =
		appointment.status === 'CANCELLED' ||
		appointment.cancelledAt != null ||
		appointment.cancelReason != null

	const cancelledByValue =
		appointment.cancelledBy != null
			? cancelledByLabel(appointment.cancelledBy)
			: null

	return (
		<BasePage
			edges={hasChat ? ['top'] : undefined}
			headerContent={<BackButton />}
			footerContent={
				hasChat ? (
					<View style={{ paddingBottom: insets.bottom }}>
						<Button
							className='w-full'
							style={{ maxWidth: '90%', marginHorizontal: 'auto' }}
							onPress={() => router.push(`/chat/${chatId}`)}
						>
							<Ionicons
								color={accentForegroundColor}
								name='chatbubble-outline'
								size={20}
							/>
							<Button.Label>{tBtn('openChat')}</Button.Label>
						</Button>
					</View>
				) : undefined
			}
		>
			<View className='gap-3'>
				<Card className='bg-surface border border-border'>
					<Card.Header className='gap-3'>
						<View className='flex-row justify-between items-start gap-3'>
							<View className='flex-1 gap-2'>
								<Text className='font-bold text-foreground text-2xl'>
									{appointment.serviceName}
								</Text>
								<Chip color='accent' variant='soft'>
									{tStatus(appointment.status)}
								</Chip>
							</View>

							<View className='items-center bg-accent px-4 py-3 rounded-2xl'>
								<Text className='font-bold text-xl text-accent-foreground'>
									{formattedDate.day}
								</Text>
								<Text className='font-semibold text-xs text-accent-foreground'>
									{formattedDate.month}
								</Text>
							</View>
						</View>
					</Card.Header>

					<Card.Body className='mt-2'>
						<View className='flex-row flex-wrap justify-between gap-3'>
							<RecordInfoTile
								icon='calendar-outline'
								label={tField('date')}
								value={formattedDate.full}
							/>
							<RecordInfoTile
								icon='time-outline'
								label={tField('startTime')}
								value={timeLabel}
							/>
							<RecordInfoTile
								icon='hourglass-outline'
								label={tField('duration')}
								value={tUi('durationMinutes', {
									count: appointment.durationMinutes,
								})}
							/>
							<RecordInfoTile
								icon='cash-outline'
								label={tField('cost')}
								value={formatPriceByCurrency(
									appointment.totalPrice,
									ECurrency.RUB,
								)}
							/>
						</View>
					</Card.Body>
				</Card>

				{isCancelled ? (
					<Card className='bg-surface border border-border'>
						<Card.Header>
							<Text className='font-bold text-foreground text-lg'>
								{t('cancellation')}
							</Text>
						</Card.Header>
						<Card.Body className='gap-3 mt-2 p-0'>
							{appointment.cancelledAt ? (
								<RecordInfoRow
									icon='close-circle-outline'
									label={tField('cancelledAt')}
									value={FormatDateTime(new Date(appointment.cancelledAt))}
								/>
							) : null}
							{cancelledByValue ? (
								<RecordInfoRow
									icon='person-circle-outline'
									label={tField('cancelledBy')}
									value={cancelledByValue}
								/>
							) : null}
							{appointment.cancelReason ? (
								<RecordInfoRow
									icon='chatbubble-ellipses-outline'
									label={tField('cancelReason')}
									value={appointment.cancelReason}
								/>
							) : null}
						</Card.Body>
					</Card>
				) : null}

				<Card className='bg-surface border border-border'>
					<Card.Header>
						<Text className='font-bold text-foreground text-lg'>
							{peerSectionTitle}
						</Text>
					</Card.Header>
					<Card.Body className='gap-3 mt-2 p-0'>
						<View className='flex-row items-center gap-3'>
							<Avatar alt={peerTitle} color='accent'>
								<Avatar.Fallback>
									{peerTitle.trim()[0]?.toUpperCase() ?? '?'}
								</Avatar.Fallback>
							</Avatar>
							<Text className='font-semibold text-foreground text-lg'>
								{peerTitle}
							</Text>
						</View>

						{isMasterMode && clientUser ? (
							<>
								<RecordInfoRow
									icon='at-outline'
									label={tField('username')}
									value={clientUser.username}
								/>
								<RecordInfoRow
									icon='call-outline'
									label={tField('phone')}
									value={clientUser.phone ?? '—'}
								/>
								<RecordInfoRow
									icon='mail-outline'
									label={tField('email')}
									value={clientUser.email}
								/>
							</>
						) : null}

						{!isMasterMode && masterProfile ? (
							<>
								<RecordInfoRow
									icon='star-outline'
									label={tField('rating')}
									value={String(masterProfile.rating)}
								/>
								{masterProfile.description ? (
									<RecordInfoRow
										icon='information-circle-outline'
										label={tField('description')}
										value={masterProfile.description}
									/>
								) : null}
							</>
						) : null}
					</Card.Body>
				</Card>

				<Card className='bg-surface border border-border'>
					<Card.Header>
						<Text className='font-bold text-foreground text-lg'>
							{t('serviceSection')}
						</Text>
					</Card.Header>
					<Card.Body className='gap-3 mt-2 p-0'>
						<RecordInfoRow
							icon='briefcase-outline'
							label={tField('name')}
							value={appointment.serviceName}
						/>
						{masterService?.name &&
						masterService.name !== appointment.serviceName ? (
							<RecordInfoRow
								icon='pricetag-outline'
								label={tField('masterService')}
								value={masterService.name}
							/>
						) : null}
						{masterService?.description ? (
							<RecordInfoRow
								icon='document-text-outline'
								label={tField('description')}
								value={masterService.description}
							/>
						) : null}
						{masterService?.price != null ? (
							<RecordInfoRow
								icon='wallet-outline'
								label={tField('servicePrice')}
								value={formatPriceByCurrency(
									masterService.price,
									ECurrency.RUB,
								)}
							/>
						) : null}
						{masterService?.durationMinutes != null ? (
							<RecordInfoRow
								icon='timer-outline'
								label={tField('serviceDuration')}
								value={tUi('durationMinutes', {
									count: masterService.durationMinutes,
								})}
							/>
						) : null}
					</Card.Body>
				</Card>
			</View>
		</BasePage>
	)
}

interface IRecordInfoTileProps {
	icon: keyof typeof Ionicons.glyphMap
	label: string
	value: string
	wide?: boolean
}

function RecordInfoTile({
	icon,
	label,
	value,
	wide = false,
}: IRecordInfoTileProps): ReactElement {
	const mutedColor = useThemeColor('muted')

	return (
		<View
			className='gap-2 bg-background-secondary p-3 border border-border rounded-2xl'
			style={{ width: wide ? '100%' : '48%' }}
		>
			<View className='self-start bg-surface p-2 rounded-xl'>
				<Ionicons color={mutedColor} name={icon} size={18} />
			</View>
			<Text className='text-muted text-xs'>{label}</Text>
			<Text
				className='font-semibold text-foreground text-sm'
				numberOfLines={wide ? undefined : 2}
			>
				{value}
			</Text>
		</View>
	)
}

interface IRecordInfoRowProps {
	icon: keyof typeof Ionicons.glyphMap
	label: string
	value: string
}

function RecordInfoRow({
	icon,
	label,
	value,
}: IRecordInfoRowProps): ReactElement {
	const mutedColor = useThemeColor('muted')

	return (
		<View className='flex-row items-center gap-3 bg-background-secondary px-3 py-3 rounded-xl'>
			<Ionicons color={mutedColor} name={icon} size={20} />
			<View className='flex-1 gap-0.5'>
				<Text className='text-muted text-xs'>{label}</Text>
				<Text className='text-foreground text-base'>{value}</Text>
			</View>
		</View>
	)
}
