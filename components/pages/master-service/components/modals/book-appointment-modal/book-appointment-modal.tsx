import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { ScheduleSimpleField } from '@/components/pages/master-settings/schedule-simple-field'
import { useAppointmentCreate } from '@/hooks/actions/appointment/use-appointment-create'
import { useMasterServiceGetAvailableSlots } from '@/hooks/actions/master-service/use-master-service-get-available-slots'
import { formatDate } from '@/utils/format-date.util'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { BottomSheet, Button, Spinner } from 'heroui-native'
import type { ReactElement } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Text, View } from 'react-native'

const BOOKING_DATE_OPTIONS_COUNT = 14

interface IBookAppointmentModalProps {
	isVisible: boolean
	service: IMasterService
	onClose: () => void
}

function toLocalDateKey(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

function buildDateOptions(count: number): string[] {
	const start = new Date()
	start.setHours(0, 0, 0, 0)

	return Array.from({ length: count }, (_, index) => {
		const date = new Date(start)
		date.setDate(start.getDate() + index)
		return toLocalDateKey(date)
	})
}

function formatSlotTime(iso: string, timezone?: string): string {
	const date = new Date(iso)
	return date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: timezone || undefined,
	})
}

export function BookAppointmentModal({
	isVisible,
	service,
	onClose,
}: IBookAppointmentModalProps): ReactElement {
	const router = useRouter()
	const createAppointment = useAppointmentCreate()
	const dateOptions = useMemo(() => buildDateOptions(BOOKING_DATE_OPTIONS_COUNT), [])
	const [selectedDate, setSelectedDate] = useState(dateOptions[0] ?? '')
	const [selectedStartsAt, setSelectedStartsAt] = useState<string | null>(null)
	const [message, setMessage] = useState('')

	const slotsQuery = useMasterServiceGetAvailableSlots(
		service.id,
		selectedDate,
		isVisible,
	)

	const wasVisibleRef = useRef(false)

	useEffect(() => {
		if (isVisible && !wasVisibleRef.current) {
			setSelectedDate(dateOptions[0] ?? '')
			setSelectedStartsAt(null)
			setMessage('')
		}
		wasVisibleRef.current = isVisible
	}, [dateOptions, isVisible])

	useEffect(() => {
		setSelectedStartsAt(null)
	}, [selectedDate])

	const handleOpenChange = (value: boolean) => {
		if (!value) {
			onClose()
		}
	}

	const handleSubmit = async () => {
		const masterProfileId = service.masterProfileId
		if (!masterProfileId || !selectedStartsAt || createAppointment.isPending) {
			return
		}

		const trimmedMessage = message.trim()
		const appointment = await createAppointment.mutateAsync({
			masterProfileId,
			masterServiceId: service.id,
			startsAt: selectedStartsAt,
			...(trimmedMessage
				? { initialMessage: { body: trimmedMessage } }
				: {}),
		})

		onClose()

		if (appointment?.id) {
			router.push(`/record/${appointment.id}`)
		}
	}

	const slots = slotsQuery.data?.slots ?? []
	const timezone = slotsQuery.data?.timezone

	return (
		<BottomSheet isOpen={isVisible} onOpenChange={handleOpenChange}>
			<BottomSheet.Portal>
				<BottomSheet.Overlay />
				<BottomSheet.Content
					contentContainerClassName='h-full px-4'
					enableDynamicSizing={false}
					enableOverDrag={false}
					snapPoints={['75%', '92%']}
				>
					<BottomSheet.Title>Запись на услугу</BottomSheet.Title>
					<BottomSheet.Description>
						{service.name} · {service.price} ₽
						{service.durationMinutes != null
							? ` · ${service.durationMinutes} мин`
							: ''}
					</BottomSheet.Description>

					<BottomSheetScrollView
						contentContainerClassName='gap-4 pb-6'
						keyboardShouldPersistTaps='handled'
						showsVerticalScrollIndicator={false}
					>
						<View className='gap-2'>
							<Text className='text-sm font-medium text-foreground'>Дата</Text>
							<View className='flex-row flex-wrap gap-2'>
								{dateOptions.map((date) => {
									const label = formatDate(date)
									const isSelected = selectedDate === date

									return (
										<Button
											key={date}
											className='min-w-[72px]'
											onPress={() => setSelectedDate(date)}
											size='sm'
											variant={isSelected ? 'primary' : 'outline'}
										>
											<Button.Label>
												{label.day} {label.month}
											</Button.Label>
										</Button>
									)
								})}
							</View>
						</View>

						<View className='gap-2'>
							<Text className='text-sm font-medium text-foreground'>
								Свободное время
							</Text>
							{slotsQuery.isLoading ? (
								<View className='items-center py-6'>
									<Spinner size='sm' />
								</View>
							) : slots.length === 0 ? (
								<Text className='text-sm text-muted'>
									На выбранную дату свободных окон нет
								</Text>
							) : (
								<View className='flex-row flex-wrap gap-2'>
									{slots.map((slot) => {
										const isSelected = selectedStartsAt === slot.startsAt

										return (
											<Button
												key={slot.startsAt}
												onPress={() => setSelectedStartsAt(slot.startsAt)}
												size='sm'
												variant={isSelected ? 'primary' : 'outline'}
											>
												<Button.Label>
													{formatSlotTime(slot.startsAt, timezone)}
												</Button.Label>
											</Button>
										)
									})}
								</View>
							)}
						</View>

						<ScheduleSimpleField
							label='Сообщение мастеру (необязательно)'
							value={message}
							onChangeText={setMessage}
							inputProps={{
								multiline: true,
								numberOfLines: 3,
								placeholder: 'Пожелания или вопрос перед записью',
							}}
						/>

						<Button
							className='rounded-2xl'
							isDisabled={
								!selectedStartsAt ||
								createAppointment.isPending ||
								slotsQuery.isLoading
							}
							onPress={handleSubmit}
							variant='primary'
						>
							{createAppointment.isPending ? (
								<Spinner size='sm' color='white' />
							) : (
								<Button.Label>Подтвердить запись</Button.Label>
							)}
						</Button>
					</BottomSheetScrollView>
				</BottomSheet.Content>
			</BottomSheet.Portal>
		</BottomSheet>
	)
}
