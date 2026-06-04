import { z } from 'zod'
import { HhMmTimeSchema } from '@/actions/base-models/payload/hh-mm-time.schema'
import { MasterScheduleExceptionKindSchema } from './master-schedule-exception-shared.schema'

export const MasterScheduleExceptionUpdatePayloadSchema = z.object({
	startsAt: z.string().datetime().optional(),
	endsAt: z.string().datetime().optional(),
	kind: MasterScheduleExceptionKindSchema.optional(),
	customStartTime: HhMmTimeSchema.nullable().optional(),
	customEndTime: HhMmTimeSchema.nullable().optional(),
	title: z.string().max(255).nullable().optional(),
	note: z.string().max(5000).nullable().optional(),
})

export type IMasterScheduleExceptionUpdatePayload = z.infer<
	typeof MasterScheduleExceptionUpdatePayloadSchema
>
