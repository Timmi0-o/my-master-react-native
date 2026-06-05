import {
	MasterScheduleExceptionEditSchema,
	type IMasterScheduleExceptionEdit,
} from '@/actions/master-schedule-exception/models/master-schedule-exception-edit.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterScheduleExceptionGetOne } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-get-one'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Text, View } from 'react-native'
import { DateTimeSelectField } from './components/datetime-select-field'
import { ExceptionKindField } from './components/exception-kind-field'
import { ScheduleFormField } from './components/schedule-form-field'
import { TimeOfDaySelectField } from './components/time-of-day-select-field'
import { MASTER_SCHEDULE_EXCEPTION_EDIT_DEFAULT_VALUES } from './data/master-schedule-exception-edit-default-values'
import { useOnSubmitMasterScheduleExceptionEditForm } from './hooks/use-on-submit-master-schedule-exception-edit-form'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterScheduleExceptionEditPageProps {
	masterProfile: IMasterProfile
	exceptionId?: string
}

export function MasterScheduleExceptionEditPage({
	masterProfile,
	exceptionId,
}: IMasterScheduleExceptionEditPageProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tCommon } = useScopedTranslation('common')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')
	const isEdit = Boolean(exceptionId)

	const { data: existing, isLoading } = useMasterScheduleExceptionGetOne(
		exceptionId ?? '',
		isEdit,
	)

	const { control, handleSubmit, reset } = useForm<IMasterScheduleExceptionEdit>(
		{
			resolver: zodResolver(MasterScheduleExceptionEditSchema),
			defaultValues: MASTER_SCHEDULE_EXCEPTION_EDIT_DEFAULT_VALUES(),
			mode: 'onTouched',
		},
	)

	const { onSubmit, isPending } = useOnSubmitMasterScheduleExceptionEditForm({
		masterProfileId: masterProfile.id,
		exceptionId,
	})

	const kind = useWatch({ control, name: 'kind' })

	useEffect(() => {
		if (existing) {
			reset(MASTER_SCHEDULE_EXCEPTION_EDIT_DEFAULT_VALUES(existing))
		}
	}, [existing, reset])

	if (isEdit && isLoading) {
		return (
			<BasePage>
				<ScheduleScreenHeader title={t('exceptionEdit')} />
				<Text className='text-muted'>{tCommon('loading')}</Text>
			</BasePage>
		)
	}

	return (
		<BasePage>
			<ScheduleScreenHeader
				title={isEdit ? t('exceptionEdit') : t('exceptionNew')}
			/>

			<View className='gap-4'>
				<View className='gap-2'>
					<Text className='px-1 text-sm font-semibold uppercase text-muted'>
						{tField('type')}
					</Text>
					<ExceptionKindField control={control} name='kind' />
				</View>

				<View className='gap-2'>
					<Text className='px-1 text-sm font-semibold uppercase text-muted'>
						{t('exceptionPeriod')}
					</Text>
					<View className='gap-4 rounded-2xl border border-border bg-background-secondary p-4'>
						<DateTimeSelectField
							control={control}
							dateOptionsParams={{ pastDays: 365, futureDays: 365 }}
							label={tField('periodStart')}
							name='startsAt'
							placeholder={tPlaceholder('periodStart')}
							timeOptionsParams={{ enforceFutureForToday: false }}
						/>
						<DateTimeSelectField
							control={control}
							dateOptionsParams={{ pastDays: 365, futureDays: 365 }}
							label={tField('periodEnd')}
							name='endsAt'
							placeholder={tPlaceholder('periodEnd')}
							timeOptionsParams={{ enforceFutureForToday: false }}
						/>
					</View>
				</View>

				{kind === 'CUSTOM_HOURS' ? (
					<View className='gap-2'>
						<Text className='px-1 text-sm font-semibold uppercase text-muted'>
							{t('customWorkHours')}
						</Text>
						<View className='gap-4 rounded-2xl border border-border bg-background-secondary p-4'>
							<TimeOfDaySelectField
								control={control}
								label={tField('workStart')}
								name='customStartTime'
								placeholder={tPlaceholder('workStart')}
							/>
							<TimeOfDaySelectField
								control={control}
								label={tField('workEnd')}
								name='customEndTime'
								placeholder={tPlaceholder('workEnd')}
							/>
						</View>
					</View>
				) : null}

				<View className='gap-2'>
					<Text className='px-1 text-sm font-semibold uppercase text-muted'>
						{t('exceptionDetails')}
					</Text>
					<View className='gap-4 rounded-2xl border border-border bg-background-secondary p-4'>
						<ScheduleFormField
							control={control}
							label={tField('titleOptional')}
							name='title'
						/>
						<ScheduleFormField
							control={control}
							inputProps={{ multiline: true, numberOfLines: 4 }}
							label={tField('noteOptional')}
							name='note'
						/>
					</View>
				</View>

				<Button
					className='rounded-2xl'
					isDisabled={isPending}
					onPress={handleSubmit(onSubmit)}
					variant='primary'
				>
					<Button.Label>
						{isPending ? tBtn('saving') : tBtn('save')}
					</Button.Label>
				</Button>
			</View>
		</BasePage>
	)
}
