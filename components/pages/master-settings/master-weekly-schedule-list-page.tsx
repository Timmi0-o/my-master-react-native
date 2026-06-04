import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type {
	IMasterWeeklySchedule,
	TDayOfWeek,
} from '@/actions/master-weekly-schedule/models/master-weekly-schedule.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import {
	DAY_OF_WEEK_LABELS,
	DAY_OF_WEEK_ORDER,
} from '@/constants/master-schedule.constants'
import { useMasterWeeklyScheduleDelete } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-delete'
import { useMasterWeeklyScheduleGetMany } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-get-many'
import { useRouter } from 'expo-router'
import { Button, Card, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterWeeklyScheduleListPageProps {
	masterProfile: IMasterProfile
}

function groupByDay(
	items: IMasterWeeklySchedule[],
): Record<TDayOfWeek, IMasterWeeklySchedule[]> {
	const map = Object.fromEntries(
		DAY_OF_WEEK_ORDER.map((day) => [day, [] as IMasterWeeklySchedule[]]),
	) as Record<TDayOfWeek, IMasterWeeklySchedule[]>

	for (const item of items) {
		map[item.dayOfWeek].push(item)
	}

	return map
}

export function MasterWeeklyScheduleListPage({
	masterProfile,
}: IMasterWeeklyScheduleListPageProps): ReactElement {
	const router = useRouter()
	const { data = [], isLoading } = useMasterWeeklyScheduleGetMany(
		masterProfile.id,
	)
	const deleteMutation = useMasterWeeklyScheduleDelete(masterProfile.id)
	const grouped = groupByDay(data)

	return (
		<BasePage>
			<ScheduleScreenHeader title='Недельное расписание' />

			<Button
				className='mb-4'
				variant='primary'
				onPress={() =>
					router.push('/master-settings/weekly-schedule/edit')
				}
			>
				<Button.Label>Добавить интервал</Button.Label>
			</Button>

			{isLoading ? (
				<Text className='text-muted'>Загрузка...</Text>
			) : (
				<View style={{ rowGap: 12 }}>
					{DAY_OF_WEEK_ORDER.map((day) => {
						const intervals = grouped[day]
						if (!intervals.length) return null

						return (
							<Card key={day}>
								<Card.Header>
									<Text className='font-semibold text-foreground'>
										{DAY_OF_WEEK_LABELS[day]}
									</Text>
								</Card.Header>
								<Card.Body className='gap-2 p-0'>
									{intervals.map((interval) => (
										<View
											key={interval.id}
											className='flex-row items-center justify-between gap-2'
										>
											<Chip color='default'>
												{interval.startTime} – {interval.endTime}
											</Chip>
											<View className='flex-row gap-2'>
												<Button
													size='sm'
													variant='outline'
													onPress={() =>
														router.push({
															pathname:
																'/master-settings/weekly-schedule/edit',
															params: { id: interval.id },
														})
													}
												>
													<Button.Label>Изм.</Button.Label>
												</Button>
												<Button
													size='sm'
													variant='danger'
													onPress={() =>
														void deleteMutation.mutateAsync(interval.id)
													}
													isDisabled={deleteMutation.isPending}
												>
													<Button.Label>Удал.</Button.Label>
												</Button>
											</View>
										</View>
									))}
								</Card.Body>
							</Card>
						)
					})}
					{!data.length ? (
						<Text className='text-center text-muted'>
							Нет интервалов. Добавьте рабочие часы по дням недели.
						</Text>
					) : null}
				</View>
			)}
		</BasePage>
	)
}
