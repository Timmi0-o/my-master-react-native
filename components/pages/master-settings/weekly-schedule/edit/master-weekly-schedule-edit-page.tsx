import type { TDayOfWeek } from '@/actions/master-weekly-schedule/models/master-weekly-schedule.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { SaveButton } from '@/components/shared/ui/save-button/save-button'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { DAY_OF_WEEK_ORDER } from '@/constants/master-schedule.constants'
import { useMasterWeeklyScheduleCreate } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-create'
import { useMasterWeeklyScheduleGetOne } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-get-one'
import { useMasterWeeklyScheduleUpdate } from '@/hooks/actions/master-weekly-schedule/use-master-weekly-schedule-update'
import { useRouter } from 'expo-router'
import { Button, Card, useToast } from 'heroui-native'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from '../../components/schedule-screen-header'
import { ScheduleSimpleField } from '../../components/schedule-simple-field'

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
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tCommon } = useScopedTranslation('common')
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')
	const dayOfWeekLabel = useEnumLabel('enums.dayOfWeek')
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

	const isSavePending = createMutation.isPending || updateMutation.isPending

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

		toast.show({
			variant: 'success',
			label: scopedT('saved', 'common', 'toasts'),
		})
		router.back()
	}

	if (isEdit && isLoading) {
		return (
			<BasePage>
				<ScheduleScreenHeader
					title={isEdit ? t('intervalEdit') : t('intervalNew')}
				/>
				<Text className='text-muted'>{tCommon('loading')}</Text>
			</BasePage>
		)
	}

	return (
		<BasePage
			headerContent={
				<ScheduleScreenHeader
					title={isEdit ? t('intervalEdit') : t('intervalNew')}
					extraContent={
						<SaveButton
							isDisabled={isSavePending}
							isIconOnly
							isLoading={isSavePending}
							onPress={() => void handleSave()}
						/>
					}
				/>
			}
			adjustForKeyboard
		>
			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Header>
						<Text className='font-semibold text-foreground'>
							{tField('dayOfWeek')}
						</Text>
					</Card.Header>
					<Card.Body className='flex-row flex-wrap gap-2 p-0'>
						{DAY_OF_WEEK_ORDER.map((day) => (
							<Button
								key={day}
								size='sm'
								variant={dayOfWeek === day ? 'primary' : 'outline'}
								onPress={() => setDayOfWeek(day)}
							>
								<Button.Label>{dayOfWeekLabel(day)}</Button.Label>
							</Button>
						))}
					</Card.Body>
				</Card>

				<ScheduleSimpleField
					label={tField('startHhMm')}
					value={startTime}
					onChangeText={setStartTime}
					inputProps={{ placeholder: tPlaceholder('timeStart') }}
				/>
				<ScheduleSimpleField
					label={tField('endHhMm')}
					value={endTime}
					onChangeText={setEndTime}
					inputProps={{ placeholder: tPlaceholder('timeEnd') }}
				/>
			</View>
		</BasePage>
	)
}
