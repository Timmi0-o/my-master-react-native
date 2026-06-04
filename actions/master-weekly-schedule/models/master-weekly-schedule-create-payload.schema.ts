import { z } from 'zod'
import { HhMmTimeSchema } from '@/actions/base-models/payload/hh-mm-time.schema'
import { DayOfWeekSchema } from './master-weekly-schedule-shared.schema'

export const MasterWeeklyScheduleCreatePayloadSchema = z.object({
	masterProfileId: z.string().min(1),
	dayOfWeek: DayOfWeekSchema,
	startTime: HhMmTimeSchema,
	endTime: HhMmTimeSchema,
})

export type IMasterWeeklyScheduleCreatePayload = z.infer<
	typeof MasterWeeklyScheduleCreatePayloadSchema
>
