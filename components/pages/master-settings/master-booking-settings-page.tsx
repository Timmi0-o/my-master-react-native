import type {
	IMasterProfile,
	TMasterBookingStatus,
} from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { BOOKING_STATUS_LABELS } from '@/constants/master-schedule.constants'
import { useMasterProfileUpdate } from '@/hooks/actions/master/use-master-profile-update'
import { useRouter } from 'expo-router'
import { Button, Card } from 'heroui-native'
import { useToast } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'
import { ScheduleSimpleField } from './schedule-simple-field'

const BOOKING_STATUSES: TMasterBookingStatus[] = [
	'ACCEPTING',
	'PAUSED',
	'CLOSED',
]

interface IMasterBookingSettingsPageProps {
	masterProfile: IMasterProfile
}

export function MasterBookingSettingsPage({
	masterProfile,
}: IMasterBookingSettingsPageProps): ReactElement {
	const router = useRouter()
	const { toast } = useToast()
	const updateMutation = useMasterProfileUpdate(masterProfile.id)

	const [bookingStatus, setBookingStatus] = useState<TMasterBookingStatus>(
		masterProfile.bookingStatus ?? 'ACCEPTING',
	)
	const [pausedUntil, setPausedUntil] = useState(
		masterProfile.pausedUntil
			? masterProfile.pausedUntil.slice(0, 16).replace('T', ' ')
			: '',
	)
	const [timezone, setTimezone] = useState(
		masterProfile.timezone ?? 'Europe/Moscow',
	)
	const [minNoticeMinutes, setMinNoticeMinutes] = useState(
		String(masterProfile.minNoticeMinutes ?? 60),
	)
	const [maxBookingDaysAhead, setMaxBookingDaysAhead] = useState(
		String(masterProfile.maxBookingDaysAhead ?? 60),
	)
	const [slotStepMinutes, setSlotStepMinutes] = useState(
		String(masterProfile.slotStepMinutes ?? 30),
	)
	const [bufferBetweenAppointmentsMinutes, setBufferBetweenAppointmentsMinutes] =
		useState(String(masterProfile.bufferBetweenAppointmentsMinutes ?? 0))

	const handleSave = async (): Promise<void> => {
		const pausedUntilIso =
			bookingStatus === 'PAUSED' && pausedUntil.trim()
				? new Date(pausedUntil.trim().replace(' ', 'T')).toISOString()
				: null

		await updateMutation.mutateAsync({
			bookingStatus,
			timezone: timezone.trim(),
			pausedUntil: bookingStatus === 'PAUSED' ? pausedUntilIso : null,
			minNoticeMinutes: Number(minNoticeMinutes) || 60,
			maxBookingDaysAhead: Number(maxBookingDaysAhead) || 60,
			slotStepMinutes: Number(slotStepMinutes) || 30,
			bufferBetweenAppointmentsMinutes:
				Number(bufferBetweenAppointmentsMinutes) || 0,
		})

		toast.show({
			variant: 'success',
			label: 'Сохранено',
		})
		router.back()
	}

	return (
		<BasePage>
			<ScheduleScreenHeader title='Приём записей' />

			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Header>
						<Text className='font-semibold text-foreground'>Статус</Text>
					</Card.Header>
					<Card.Body className='gap-2 p-0'>
						{BOOKING_STATUSES.map((status) => (
							<Button
								key={status}
								variant={bookingStatus === status ? 'primary' : 'outline'}
								size='sm'
								onPress={() => setBookingStatus(status)}
							>
								<Button.Label>{BOOKING_STATUS_LABELS[status]}</Button.Label>
							</Button>
						))}
					</Card.Body>
				</Card>

				{bookingStatus === 'PAUSED' ? (
					<ScheduleSimpleField
						label='Пауза до (YYYY-MM-DD HH:mm)'
						value={pausedUntil}
						onChangeText={setPausedUntil}
						inputProps={{ placeholder: '2026-06-10 18:00' }}
					/>
				) : null}

				<ScheduleSimpleField
					label='Часовой пояс (IANA)'
					value={timezone}
					onChangeText={setTimezone}
				/>
				<ScheduleSimpleField
					label='Мин. время до записи (минуты)'
					value={minNoticeMinutes}
					onChangeText={setMinNoticeMinutes}
					inputProps={{ keyboardType: 'number-pad' }}
				/>
				<ScheduleSimpleField
					label='Макс. дней вперёд для брони'
					value={maxBookingDaysAhead}
					onChangeText={setMaxBookingDaysAhead}
					inputProps={{ keyboardType: 'number-pad' }}
				/>
				<ScheduleSimpleField
					label='Шаг слотов (минуты)'
					value={slotStepMinutes}
					onChangeText={setSlotStepMinutes}
					inputProps={{ keyboardType: 'number-pad' }}
				/>
				<ScheduleSimpleField
					label='Пауза между записями (минуты)'
					value={bufferBetweenAppointmentsMinutes}
					onChangeText={setBufferBetweenAppointmentsMinutes}
					inputProps={{ keyboardType: 'number-pad' }}
				/>

				<Button
					variant='primary'
					onPress={() => void handleSave()}
					isDisabled={updateMutation.isPending}
				>
					<Button.Label>
						{updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
					</Button.Label>
				</Button>
			</View>
		</BasePage>
	)
}
