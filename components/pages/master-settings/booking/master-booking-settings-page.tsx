import {
	MasterProfileEditSchema,
	type IMasterProfileEdit,
} from '@/actions/master/models/master-profile-edit.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { SaveButton } from '@/components/shared/ui/save-button/save-button'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, Typography } from 'heroui-native'
import type { ReactElement } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from 'react-native-reanimated'
import { ScheduleFormField } from '../components/schedule-form-field'
import { MasterBookingSettingsHeader } from './components/master-booking-settings-header'
import { BookingStatusField } from './components/booking-status-field'
import { PausedUntilField } from './components/paused-until-field'
import { TimezoneSelectField } from './components/timezone-select-field'
import { MASTER_PROFILE_EDIT_DEFAULT_VALUES } from './data/master-profile-edit-default-values'
import { useOnSubmitMasterProfileEditForm } from './hooks/use-on-submit-master-profile-edit-form'

interface IMasterBookingSettingsPageProps {
	masterProfile: IMasterProfile
}

export function MasterBookingSettingsPage({
	masterProfile,
}: IMasterBookingSettingsPageProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tField } = useScopedTranslation('ui', 'field')

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<IMasterProfileEdit>({
		resolver: zodResolver(MasterProfileEditSchema),
		defaultValues: MASTER_PROFILE_EDIT_DEFAULT_VALUES(masterProfile),
		mode: 'onTouched',
	})

	const { onSubmit, isPending } = useOnSubmitMasterProfileEditForm(
		masterProfile.id,
	)
	const bookingStatus = useWatch({ control, name: 'bookingStatus' })

	const isSaveDisabled = isPending || isSubmitting
	const isSaveLoading = isPending || isSubmitting

	return (
		<BasePage
			headerContent={
				<MasterBookingSettingsHeader
					rightContent={
						<SaveButton
							isDisabled={isSaveDisabled}
							isIconOnly
							isLoading={isSaveLoading}
							onPress={() => void handleSubmit(onSubmit)()}
						/>
					}
					title={t('bookingTitle')}
				/>
			}
			adjustForKeyboard
		>
			<Animated.View className='gap-4' layout={LinearTransition.duration(280)}>
				<Animated.View
					className='gap-2'
					layout={LinearTransition.duration(280)}
				>
					<Typography type='h3' style={{ marginLeft: 8 }}>
						{tField('status')}
					</Typography>
					<BookingStatusField control={control} name='bookingStatus' />
					{bookingStatus === 'PAUSED' ? (
						<Animated.View
							entering={FadeIn.duration(120)}
							exiting={FadeOut.duration(100)}
							layout={LinearTransition.duration(200)}
						>
							<PausedUntilField control={control} name='pausedUntil' />
						</Animated.View>
					) : null}
				</Animated.View>

				<Animated.View
					className='gap-2'
					layout={LinearTransition.duration(280)}
				>
					<Typography type='h3' style={{ marginLeft: 8 }}>
						{t('bookingRules')}
					</Typography>

					<Card>
						<Card.Body>
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
						</Card.Body>
					</Card>
				</Animated.View>
			</Animated.View>
		</BasePage>
	)
}
