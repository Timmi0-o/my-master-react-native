import {
	MasterProfileEditSchema,
	type IMasterProfileEdit,
} from '@/actions/master/models/master-profile-edit.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Text, View } from 'react-native'
import { BookingStatusField } from './components/booking-status-field'
import { PausedUntilField } from './components/paused-until-field'
import { ScheduleFormField } from './components/schedule-form-field'
import { TimezoneSelectField } from './components/timezone-select-field'
import { MASTER_PROFILE_EDIT_DEFAULT_VALUES } from './data/master-profile-edit-default-values'
import { useOnSubmitMasterProfileEditForm } from './hooks/use-on-submit-master-profile-edit-form'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterBookingSettingsPageProps {
	masterProfile: IMasterProfile
}

export function MasterBookingSettingsPage({
	masterProfile,
}: IMasterBookingSettingsPageProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { t: tField } = useScopedTranslation('ui', 'field')

	const { control, handleSubmit } = useForm<IMasterProfileEdit>({
		resolver: zodResolver(MasterProfileEditSchema),
		defaultValues: MASTER_PROFILE_EDIT_DEFAULT_VALUES(masterProfile),
		mode: 'onTouched',
	})

	const { onSubmit, isPending } = useOnSubmitMasterProfileEditForm(
		masterProfile.id,
	)
	const bookingStatus = useWatch({ control, name: 'bookingStatus' })

	return (
		<BasePage>
			<ScheduleScreenHeader title={t('bookingTitle')} />

			<View className='gap-4'>
				<View className='gap-2'>
					<Text className='px-1 text-sm font-semibold uppercase text-muted'>
						{tField('status')}
					</Text>
					<BookingStatusField control={control} name='bookingStatus' />
				</View>

				{bookingStatus === 'PAUSED' ? (
					<PausedUntilField control={control} name='pausedUntil' />
				) : null}

				<View className='gap-2'>
					<Text className='px-1 text-sm font-semibold uppercase text-muted'>
						{t('bookingRules')}
					</Text>

					<View className='gap-4 rounded-2xl border border-border bg-background-secondary p-4'>
						<TimezoneSelectField control={control} name='timezone' />

						<ScheduleFormField
							control={control}
							label={tField('minLeadMinutes')}
							name='minNoticeMinutes'
							inputProps={{ keyboardType: 'number-pad' }}
						/>
						<ScheduleFormField
							control={control}
							label={tField('maxDaysAhead')}
							name='maxBookingDaysAhead'
							inputProps={{ keyboardType: 'number-pad' }}
						/>
						<ScheduleFormField
							control={control}
							label={tField('slotStepMinutes')}
							name='slotStepMinutes'
							inputProps={{ keyboardType: 'number-pad' }}
						/>
						<ScheduleFormField
							control={control}
							label={tField('gapMinutes')}
							name='bufferBetweenAppointmentsMinutes'
							inputProps={{ keyboardType: 'number-pad' }}
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
