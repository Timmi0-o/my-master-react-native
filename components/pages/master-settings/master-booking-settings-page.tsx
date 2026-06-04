import type {
	IMasterProfile,
	TMasterBookingStatus,
} from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
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
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')
	const bookingStatusLabel = useEnumLabel('enums.bookingStatus')
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
			label: scopedT('saved', 'common', 'toasts'),
		})
		router.back()
	}

	return (
		<BasePage>
			<ScheduleScreenHeader title={t('bookingTitle')} />

			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Header>
						<Text className='font-semibold text-foreground'>
							{tField('status')}
						</Text>
					</Card.Header>
					<Card.Body className='gap-2 p-0'>
						{BOOKING_STATUSES.map((status) => (
							<Button
								key={status}
								variant={bookingStatus === status ? 'primary' : 'outline'}
								size='sm'
								onPress={() => setBookingStatus(status)}
							>
								<Button.Label>{bookingStatusLabel(status)}</Button.Label>
							</Button>
						))}
					</Card.Body>
				</Card>

				{bookingStatus === 'PAUSED' ? (
					<ScheduleSimpleField
						label={tField('pauseUntil')}
						value={pausedUntil}
						onChangeText={setPausedUntil}
						inputProps={{ placeholder: tPlaceholder('pauseUntil') }}
					/>
				) : null}

				<ScheduleSimpleField
					label={tField('timezone')}
					value={timezone}
					onChangeText={setTimezone}
				/>
				<ScheduleSimpleField
					label={tField('minLeadMinutes')}
					value={minNoticeMinutes}
					onChangeText={setMinNoticeMinutes}
					inputProps={{ keyboardType: 'number-pad' }}
				/>
				<ScheduleSimpleField
					label={tField('maxDaysAhead')}
					value={maxBookingDaysAhead}
					onChangeText={setMaxBookingDaysAhead}
					inputProps={{ keyboardType: 'number-pad' }}
				/>
				<ScheduleSimpleField
					label={tField('slotStepMinutes')}
					value={slotStepMinutes}
					onChangeText={setSlotStepMinutes}
					inputProps={{ keyboardType: 'number-pad' }}
				/>
				<ScheduleSimpleField
					label={tField('gapMinutes')}
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
						{updateMutation.isPending ? tBtn('saving') : tBtn('save')}
					</Button.Label>
				</Button>
			</View>
		</BasePage>
	)
}
