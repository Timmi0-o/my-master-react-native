import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type { TDayOfWeek } from '@/actions/master-weekly-schedule/models/master-weekly-schedule.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import {
	DAY_OF_WEEK_LABELS,
	DAY_OF_WEEK_ORDER,
} from '@/constants/master-schedule.constants'
import { useMasterWeeklyScheduleCreate } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-create'
import { useMasterWeeklyScheduleGetOne } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-get-one'
import { useMasterWeeklyScheduleUpdate } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-update'
import { useRouter } from 'expo-router'
import { Button, Card } from 'heroui-native'
import { useToast } from 'heroui-native'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'
import { ScheduleSimpleField } from './schedule-simple-field'

interface IMasterWeeklyScheduleEditPageProps {
	masterProfile: IMasterProfile
	scheduleId?: string
}

export function MasterWeeklyScheduleEditPage({
	masterProfile,
	scheduleId,
}: IMasterWeeklyScheduleEditPageProps): ReactElement {
	const router = useRouter()
	const { toast } = useToast()
	const isEdit = Boolean(scheduleId)

	const { data: existing, isLoading } = useMasterWeeklyScheduleGetOne(
		scheduleId ?? '',
		isEdit,
	)
	const createMutation = useMasterWeeklyScheduleCreate(masterProfile.id)
	const updateMutation = useMasterWeeklyScheduleUpdate(masterProfile.id)

	const [dayOfWeek, setDayOfWeek] = useState<TDayOfWeek>('MONDAY')
	const [startTime, setStartTime] = useState('09:00')
	const [endTime, setEndTime] = useState('18:00')

	useEffect(() => {
		if (existing) {
			setDayOfWeek(existing.dayOfWeek)
			setStartTime(existing.startTime)
			setEndTime(existing.endTime)
		}
	}, [existing])

	const handleSave = async (): Promise<void> => {
		if (isEdit && scheduleId) {
			await updateMutation.mutateAsync({
				id: scheduleId,
				payload: { dayOfWeek, startTime, endTime },
			})
		} else {
			await createMutation.mutateAsync({
				masterProfileId: masterProfile.id,
				dayOfWeek,
				startTime,
				endTime,
			})
		}

		toast.show({ variant: 'success', label: 'Сохранено' })
		router.back()
	}

	if (isEdit && isLoading) {
		return (
			<BasePage>
				<Text className='text-muted'>Загрузка...</Text>
			</BasePage>
		)
	}

	return (
		<BasePage>
			<ScheduleScreenHeader
				title={isEdit ? 'Редактировать интервал' : 'Новый интервал'}
			/>

			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Header>
						<Text className='font-semibold text-foreground'>День недели</Text>
					</Card.Header>
					<Card.Body className='flex-row flex-wrap gap-2 p-0'>
						{DAY_OF_WEEK_ORDER.map((day) => (
							<Button
								key={day}
								size='sm'
								variant={dayOfWeek === day ? 'primary' : 'outline'}
								onPress={() => setDayOfWeek(day)}
							>
								<Button.Label>{DAY_OF_WEEK_LABELS[day]}</Button.Label>
							</Button>
						))}
					</Card.Body>
				</Card>

				<ScheduleSimpleField
					label='Начало (HH:mm)'
					value={startTime}
					onChangeText={setStartTime}
					inputProps={{ placeholder: '09:00' }}
				/>
				<ScheduleSimpleField
					label='Конец (HH:mm)'
					value={endTime}
					onChangeText={setEndTime}
					inputProps={{ placeholder: '18:00' }}
				/>

				<Button
					variant='primary'
					onPress={() => void handleSave()}
					isDisabled={createMutation.isPending || updateMutation.isPending}
				>
					<Button.Label>Сохранить</Button.Label>
				</Button>
			</View>
		</BasePage>
	)
}
