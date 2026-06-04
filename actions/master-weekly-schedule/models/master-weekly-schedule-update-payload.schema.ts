import { z } from 'zod'
import { HhMmTimeSchema } from '@/actions/base-models/payload/hh-mm-time.schema'
import { DayOfWeekSchema } from './master-weekly-schedule-shared.schema'

export const MasterWeeklyScheduleUpdatePayloadSchema = z.object({
	dayOfWeek: DayOfWeekSchema.optional(),
	startTime: HhMmTimeSchema.optional(),
	endTime: HhMmTimeSchema.optional(),
})

export type IMasterWeeklyScheduleUpdatePayload = z.infer<
	typeof MasterWeeklyScheduleUpdatePayloadSchema
>
