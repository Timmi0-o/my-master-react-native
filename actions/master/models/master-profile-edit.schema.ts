import { MasterBookingStatusSchema } from '@/actions/master/models/master-profile.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { MASTER_TIMEZONE_IDS } from '@/constants/master-timezones.constants'
import { z } from 'zod'

const numericBookingField = (min: number, max: number, messageKey: string) =>
	z.string().refine((value) => {
		const trimmed = value.trim()

		if (!/^\d+$/.test(trimmed)) {
			return false
		}

		const parsed = Number(trimmed)

		return parsed >= min && parsed <= max
	}, scopedT(messageKey, 'common', 'validation.booking'))

export const MasterProfileEditSchema = z
	.object({
		bookingStatus: MasterBookingStatusSchema,
		pausedUntil: z.string(),
		timezone: z.enum(MASTER_TIMEZONE_IDS),
		minNoticeMinutes: numericBookingField(0, 10080, 'minNoticeInvalid'),
		maxBookingDaysAhead: numericBookingField(1, 365, 'maxDaysInvalid'),
		slotStepMinutes: numericBookingField(5, 120, 'slotStepInvalid'),
		bufferBetweenAppointmentsMinutes: numericBookingField(
			0,
			240,
			'gapInvalid',
		),
	})
	.superRefine((data, context) => {
		if (data.bookingStatus !== 'PAUSED' || data.pausedUntil.trim()) {
			return
		}

		context.addIssue({
			code: z.ZodIssueCode.custom,
			message: scopedT(
				'pausedUntilRequired',
				'common',
				'validation.booking',
			),
			path: ['pausedUntil'],
		})
	})

export type IMasterProfileEdit = z.infer<typeof MasterProfileEditSchema>
