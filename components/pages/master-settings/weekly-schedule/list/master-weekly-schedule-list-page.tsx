import type {
	IMasterWeeklySchedule,
	TDayOfWeek,
} from '@/actions/master-weekly-schedule/models/master-weekly-schedule.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePageLoaderListBody } from '@/components/shared/components/base-page-loader/base-page-loader'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { DAY_OF_WEEK_ORDER } from '@/constants/master-schedule.constants'
import { useMasterWeeklyScheduleDelete } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-delete'
import { useMasterWeeklyScheduleGetMany } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-get-many'
import { useRouter } from 'expo-router'
import { Button, Card, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { MasterWeeklyScheduleListHeader } from './components/master-weekly-schedule-list-header'

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
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const dayOfWeekLabel = useEnumLabel('enums.dayOfWeek')
	const { data = [], isLoading } = useMasterWeeklyScheduleGetMany(
		masterProfile.id,
	)
	const deleteMutation = useMasterWeeklyScheduleDelete(masterProfile.id)
	const grouped = groupByDay(data)

	return (
		<BasePage>
			<MasterWeeklyScheduleListHeader
				onAddPress={() => router.push('/master-settings/weekly-schedule/edit')}
				title={t('weeklyListTitle')}
			/>

			{isLoading ? (
				<BasePageLoaderListBody itemCount={3} />
			) : (
				<View style={{ rowGap: 12 }}>
					{DAY_OF_WEEK_ORDER.map((day) => {
						const intervals = grouped[day]
						if (!intervals.length) return null

						return (
							<Card key={day}>
								<Card.Header>
									<Text className='font-semibold text-foreground'>
										{dayOfWeekLabel(day)}
									</Text>
								</Card.Header>
								<Card.Body className='gap-2 mt-2'>
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
															pathname: '/master-settings/weekly-schedule/edit',
															params: { id: interval.id },
														})
													}
												>
													<Button.Label>{tBtn('editShort')}</Button.Label>
												</Button>
												<Button
													size='sm'
													variant='danger'
													onPress={() =>
														void deleteMutation.mutateAsync(interval.id)
													}
													isDisabled={deleteMutation.isPending}
												>
													<Button.Label>{tBtn('deleteShort')}</Button.Label>
												</Button>
											</View>
										</View>
									))}
								</Card.Body>
							</Card>
						)
					})}
					{!data.length ? <DataNotFound message={t('emptyIntervals')} /> : null}
				</View>
			)}
		</BasePage>
	)
}
