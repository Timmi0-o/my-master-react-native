import { createHhMmTimeSchema } from '@/actions/base-models/payload/hh-mm-time.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { z } from 'zod'
import { MasterScheduleExceptionKindSchema } from './master-schedule-exception-shared.schema'

const localDateTimeStringSchema = z
	.string()
	.trim()
	.min(
		1,
		scopedT('periodRequired', 'common', 'validation.scheduleException'),
	)
	.refine((value) => {
		if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value)) {
			return false
		}

		const parsed = new Date(value.replace(' ', 'T'))

		return !Number.isNaN(parsed.getTime())
	}, scopedT('invalidDateTime', 'common', 'validation.scheduleException'))

const parseLocalDateTime = (value: string): Date =>
	new Date(value.trim().replace(' ', 'T'))

const parseHhMmMinutes = (value: string): number => {
	const [hours, minutes] = value.split(':').map(Number)

	return hours * 60 + minutes
}

export const MasterScheduleExceptionEditSchema = z
	.object({
		kind: MasterScheduleExceptionKindSchema,
		startsAt: localDateTimeStringSchema,
		endsAt: localDateTimeStringSchema,
		customStartTime: z.string(),
		customEndTime: z.string(),
		title: z
			.string()
			.max(
				255,
				scopedT('titleTooLong', 'common', 'validation.scheduleException'),
			),
		note: z
			.string()
			.max(
				5000,
				scopedT('noteTooLong', 'common', 'validation.scheduleException'),
			),
	})
	.superRefine((data, context) => {
		const startsAt = parseLocalDateTime(data.startsAt)
		const endsAt = parseLocalDateTime(data.endsAt)

		if (endsAt <= startsAt) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: scopedT(
					'periodEndAfterStart',
					'common',
					'validation.scheduleException',
				),
				path: ['endsAt'],
			})
		}

		if (data.kind !== 'CUSTOM_HOURS') {
			return
		}

		const hhMmSchema = createHhMmTimeSchema()
		const customStartResult = hhMmSchema.safeParse(data.customStartTime.trim())
		const customEndResult = hhMmSchema.safeParse(data.customEndTime.trim())

		if (!customStartResult.success) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: scopedT(
					'customStartRequired',
					'common',
					'validation.scheduleException',
				),
				path: ['customStartTime'],
			})
		}

		if (!customEndResult.success) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: scopedT(
					'customEndRequired',
					'common',
					'validation.scheduleException',
				),
				path: ['customEndTime'],
			})
		}

		if (!customStartResult.success || !customEndResult.success) {
			return
		}

		if (
			parseHhMmMinutes(data.customEndTime) <=
			parseHhMmMinutes(data.customStartTime)
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: scopedT(
					'workEndAfterStart',
					'common',
					'validation.scheduleException',
				),
				path: ['customEndTime'],
			})
		}
	})

export type IMasterScheduleExceptionEdit = z.infer<
	typeof MasterScheduleExceptionEditSchema
>
