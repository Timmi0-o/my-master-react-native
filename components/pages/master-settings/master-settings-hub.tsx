import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { BOOKING_STATUS_LABELS } from '@/constants/master-schedule.constants'
import { useRouter } from 'expo-router'
import { Button, Card, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterSettingsHubProps {
	masterProfile: IMasterProfile
}

export function MasterSettingsHub({
	masterProfile,
}: IMasterSettingsHubProps): ReactElement {
	const router = useRouter()
	const bookingStatus = masterProfile.bookingStatus ?? 'ACCEPTING'
	const statusLabel = BOOKING_STATUS_LABELS[bookingStatus]

	return (
		<BasePage>
			<ScheduleScreenHeader title='Расписание и записи' />

			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Body className='gap-2'>
						<Text className='text-muted'>Текущий статус</Text>
						<Chip color='accent'>{statusLabel}</Chip>
						{masterProfile.pausedUntil ? (
							<Text className='text-sm text-muted'>
								Пауза до:{' '}
								{new Date(masterProfile.pausedUntil).toLocaleString('ru-RU')}
							</Text>
						) : null}
					</Card.Body>
				</Card>

				<Card>
					<Card.Body className='gap-3 p-0'>
						<Button
							variant='secondary'
							onPress={() => router.push('/master-settings/booking')}
						>
							<Button.Label>Приём записей и правила</Button.Label>
						</Button>
						<Button
							variant='secondary'
							onPress={() => router.push('/master-settings/weekly-schedule')}
						>
							<Button.Label>Недельное расписание</Button.Label>
						</Button>
						<Button
							variant='secondary'
							onPress={() =>
								router.push('/master-settings/schedule-exceptions')
							}
						>
							<Button.Label>Выходные и исключения</Button.Label>
						</Button>
					</Card.Body>
				</Card>
			</View>
		</BasePage>
	)
}
