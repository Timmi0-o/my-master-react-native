import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { BasePage } from '@/components/shared/components/base-page'
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
import { IconifyIcon } from '@huymobile/react-native-iconify'
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
							<IconifyIcon
								color={accentForegroundColor}
								name='ion:chatbubble-outline'
								size={20}
							/>
							<Button.Label>{tBtn('openChat')}</Button.Label>
						</Button>
					</View>
				) : undefined
			}
		>
			<View style={{ rowGap: 10 }}>
				<Card className='rounded-none shadow-none bg-background-secondary p-1'>
					<Card.Header className='gap-3'>
						<View className='flex-row items-start justify-between gap-3'>
							<View className='flex-1 gap-2'>
								<Text className='text-2xl font-bold text-foreground'>
									{appointment.serviceName}
								</Text>
								<Chip color='accent' variant='soft'>
									{tStatus(appointment.status)}
								</Chip>
							</View>

							<View className='items-center rounded-2xl bg-accent px-4 py-3'>
								<Text className='text-xl font-bold text-accent-foreground'>
									{formattedDate.day}
								</Text>
								<Text className='text-xs font-semibold text-accent-foreground'>
									{formattedDate.month}
								</Text>
							</View>
						</View>
					</Card.Header>

					<Card.Body className='mt-2'>
						<View className='flex-row flex-wrap justify-between gap-3'>
							<RecordInfoTile
								icon='ion:calendar-outline'
								label={tField('date')}
								value={formattedDate.full}
							/>
							<RecordInfoTile
								icon='ion:time-outline'
								label={tField('startTime')}
								value={timeLabel}
							/>
							<RecordInfoTile
								icon='ion:hourglass-outline'
								label={tField('duration')}
								value={tUi('durationMinutes', {
									count: appointment.durationMinutes,
								})}
							/>
							<RecordInfoTile
								icon='ion:cash-outline'
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
					<Card>
						<Card.Header>
							<Text className='text-lg font-bold text-foreground'>
								{t('cancellation')}
							</Text>
						</Card.Header>
						<Card.Body className='mt-2 gap-3 p-0'>
							{appointment.cancelledAt ? (
								<RecordInfoRow
									icon='ion:close-circle-outline'
									label={tField('cancelledAt')}
									value={FormatDateTime(new Date(appointment.cancelledAt))}
								/>
							) : null}
							{cancelledByValue ? (
								<RecordInfoRow
									icon='ion:person-circle-outline'
									label={tField('cancelledBy')}
									value={cancelledByValue}
								/>
							) : null}
							{appointment.cancelReason ? (
								<RecordInfoRow
									icon='ion:chatbox-ellipses-outline'
									label={tField('cancelReason')}
									value={appointment.cancelReason}
								/>
							) : null}
						</Card.Body>
					</Card>
				) : null}

				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>
							{peerSectionTitle}
						</Text>
					</Card.Header>
					<Card.Body className='mt-2 gap-3 p-0'>
						<View className='flex-row items-center gap-3'>
							<Avatar alt={peerTitle} color='accent'>
								<Avatar.Fallback>
									{peerTitle.trim()[0]?.toUpperCase() ?? '?'}
								</Avatar.Fallback>
							</Avatar>
							<Text className='text-lg font-semibold text-foreground'>
								{peerTitle}
							</Text>
						</View>

						{isMasterMode && clientUser ? (
							<>
								<RecordInfoRow
									icon='ion:at-outline'
									label={tField('username')}
									value={clientUser.username}
								/>
								<RecordInfoRow
									icon='ion:call-outline'
									label={tField('phone')}
									value={clientUser.phone ?? '—'}
								/>
								<RecordInfoRow
									icon='ion:mail-outline'
									label={tField('email')}
									value={clientUser.email}
								/>
							</>
						) : null}

						{!isMasterMode && masterProfile ? (
							<>
								<RecordInfoRow
									icon='ion:star-outline'
									label={tField('rating')}
									value={String(masterProfile.rating)}
								/>
								{masterProfile.description ? (
									<RecordInfoRow
										icon='ion:information-circle-outline'
										label={tField('description')}
										value={masterProfile.description}
									/>
								) : null}
							</>
						) : null}
					</Card.Body>
				</Card>

				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>
							{t('serviceSection')}
						</Text>
					</Card.Header>
					<Card.Body className='mt-2 gap-3 p-0'>
						<RecordInfoRow
							icon='ion:briefcase-outline'
							label={tField('name')}
							value={appointment.serviceName}
						/>
						{masterService?.name &&
						masterService.name !== appointment.serviceName ? (
							<RecordInfoRow
								icon='ion:pricetag-outline'
								label={tField('masterService')}
								value={masterService.name}
							/>
						) : null}
						{masterService?.description ? (
							<RecordInfoRow
								icon='ion:document-text-outline'
								label={tField('description')}
								value={masterService.description}
							/>
						) : null}
						{masterService?.price != null ? (
							<RecordInfoRow
								icon='ion:wallet-outline'
								label={tField('servicePrice')}
								value={formatPriceByCurrency(
									masterService.price,
									ECurrency.RUB,
								)}
							/>
						) : null}
						{masterService?.durationMinutes != null ? (
							<RecordInfoRow
								icon='ion:timer-outline'
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
	icon: string
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
			className='gap-2 rounded-2xl border border-border bg-surface p-3'
			style={{ width: wide ? '100%' : '48%' }}
		>
			<View className='self-start rounded-xl bg-background-secondary p-2'>
				<IconifyIcon color={mutedColor} name={icon} size={18} />
			</View>
			<Text className='text-xs text-muted'>{label}</Text>
			<Text
				className='text-sm font-semibold text-foreground'
				numberOfLines={wide ? undefined : 2}
			>
				{value}
			</Text>
		</View>
	)
}

interface IRecordInfoRowProps {
	icon: string
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
		<View className='flex-row items-center gap-3 rounded-xl bg-surface px-3 py-3'>
			<IconifyIcon color={mutedColor} name={icon} size={20} />
			<View className='flex-1 gap-0.5'>
				<Text className='text-xs text-muted'>{label}</Text>
				<Text className='text-base text-foreground'>{value}</Text>
			</View>
		</View>
	)
}
