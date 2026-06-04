import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { formatDate } from '@/utils/format-date.util'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Button, Card, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'

interface IRecordDetailProps {
	appointment: IAppointment
	mode: ActiveProfileMode
}

const CANCELLED_BY_LABELS = {
	CLIENT: 'Клиент',
	MASTER: 'Мастер',
	STAFF: 'Сотрудник',
} as const

export default function RecordDetail({
	appointment,
	mode,
}: IRecordDetailProps): ReactElement {
	const router = useRouter()
	const mutedColor = useThemeColor('muted')
	const dateKey = appointment.startsAt.slice(0, 10)
	const formattedDate = formatDate(dateKey)
	const startsAtDate = new Date(appointment.startsAt)
	const timeLabel = Number.isNaN(startsAtDate.getTime())
		? appointment.startsAt
		: startsAtDate.toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit',
			})

	const isMasterMode = mode === 'master'
	const clientUser = appointment.clientUser
	const masterProfile = appointment.masterProfile
	const masterService = appointment.masterService
	const chatId = appointment.chat?.id

	const peerTitle = isMasterMode
		? clientUser
			? [clientUser.name, clientUser.surname, clientUser.patronymic]
					.filter(Boolean)
					.join(' ')
					.trim() || 'Клиент'
			: 'Клиент'
		: (masterProfile?.displayName ?? 'Мастер')

	const peerSectionTitle = isMasterMode ? 'Клиент' : 'Мастер'
	const isCancelled =
		appointment.status === 'CANCELLED' ||
		appointment.cancelledAt != null ||
		appointment.cancelReason != null

	const cancelledByLabel =
		appointment.cancelledBy != null
			? (CANCELLED_BY_LABELS[appointment.cancelledBy] ??
				appointment.cancelledBy)
			: null

	return (
		<BasePage>
			<View style={{ rowGap: 20 }}>
				<Button
					className='self-start'
					onPress={() => router.back()}
					size='sm'
					variant='ghost'
				>
					<Ionicons name='arrow-back' size={20} color={mutedColor} />
					<Button.Label>Назад</Button.Label>
				</Button>

				<Card className='rounded-none shadow-none bg-background-secondary'>
					<Card.Header className='gap-3'>
						<View className='flex-row items-start justify-between gap-3'>
							<View className='flex-1 gap-2'>
								<Text className='text-2xl font-bold text-foreground'>
									{appointment.serviceName}
								</Text>
								<Chip color='accent' variant='soft'>
									{appointment.status}
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

					<Card.Body className='mt-2 gap-3 p-0'>
						<RecordInfoRow
							icon='calendar-outline'
							label='Дата'
							value={formattedDate.full}
						/>
						<RecordInfoRow
							icon='time-outline'
							label='Время начала'
							value={timeLabel}
						/>
						<RecordInfoRow
							icon='hourglass-outline'
							label='Длительность'
							value={`${appointment.durationMinutes} мин`}
						/>
						<RecordInfoRow
							icon='cash-outline'
							label='Стоимость'
							value={`${appointment.totalPrice} ₽`}
						/>
						{appointment.createdAt ? (
							<RecordInfoRow
								icon='create-outline'
								label='Создана'
								value={formatDateTime(appointment.createdAt)}
							/>
						) : null}
						{appointment.updatedAt ? (
							<RecordInfoRow
								icon='refresh-outline'
								label='Обновлена'
								value={formatDateTime(appointment.updatedAt)}
							/>
						) : null}
					</Card.Body>
				</Card>

				{isCancelled ? (
					<Card>
						<Card.Header>
							<Text className='text-lg font-bold text-foreground'>
								Отмена
							</Text>
						</Card.Header>
						<Card.Body className='mt-2 gap-3 p-0'>
							{appointment.cancelledAt ? (
								<RecordInfoRow
									icon='close-circle-outline'
									label='Дата отмены'
									value={formatDateTime(appointment.cancelledAt)}
								/>
							) : null}
							{cancelledByLabel ? (
								<RecordInfoRow
									icon='person-circle-outline'
									label='Кто отменил'
									value={cancelledByLabel}
								/>
							) : null}
							{appointment.cancelReason ? (
								<RecordInfoRow
									icon='chatbox-ellipses-outline'
									label='Причина'
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
									icon='at-outline'
									label='Username'
									value={clientUser.username}
								/>
								<RecordInfoRow
									icon='call-outline'
									label='Телефон'
									value={clientUser.phone ?? '—'}
								/>
								<RecordInfoRow
									icon='mail-outline'
									label='Email'
									value={clientUser.email}
								/>
							</>
						) : null}

						{!isMasterMode && masterProfile ? (
							<>
								<RecordInfoRow
									icon='star-outline'
									label='Рейтинг'
									value={String(masterProfile.rating)}
								/>
								{masterProfile.description ? (
									<RecordInfoRow
										icon='information-circle-outline'
										label='Описание'
										value={masterProfile.description}
									/>
								) : null}
							</>
						) : null}
					</Card.Body>
				</Card>

				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>Услуга</Text>
					</Card.Header>
					<Card.Body className='mt-2 gap-3 p-0'>
						<RecordInfoRow
							icon='briefcase-outline'
							label='Название'
							value={appointment.serviceName}
						/>
						{masterService?.name &&
						masterService.name !== appointment.serviceName ? (
							<RecordInfoRow
								icon='pricetag-outline'
								label='Услуга мастера'
								value={masterService.name}
							/>
						) : null}
						{masterService?.description ? (
							<RecordInfoRow
								icon='document-text-outline'
								label='Описание'
								value={masterService.description}
							/>
						) : null}
						{masterService?.price != null ? (
							<RecordInfoRow
								icon='wallet-outline'
								label='Цена услуги'
								value={`${masterService.price} ₽`}
							/>
						) : null}
						{masterService?.durationMinutes != null ? (
							<RecordInfoRow
								icon='timer-outline'
								label='Длительность услуги'
								value={`${masterService.durationMinutes} мин`}
							/>
						) : null}
					</Card.Body>
				</Card>

				{chatId ? (
					<Button
						className='rounded-2xl'
						onPress={() => router.push(`/chat/${chatId}`)}
						variant='outline'
					>
						<Ionicons name='chatbubble-outline' size={20} color={mutedColor} />
						<Button.Label>Открыть чат</Button.Label>
					</Button>
				) : null}
			</View>
		</BasePage>
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
		<View className='flex-row items-center gap-3 rounded-xl bg-surface px-3 py-3'>
			<Ionicons name={icon} size={20} color={mutedColor} />
			<View className='flex-1 gap-0.5'>
				<Text className='text-xs text-muted'>{label}</Text>
				<Text className='text-base text-foreground'>{value}</Text>
			</View>
		</View>
	)
}

function formatDateTime(iso: string): string {
	const date = new Date(iso)

	if (Number.isNaN(date.getTime())) {
		return iso
	}

	return date.toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
