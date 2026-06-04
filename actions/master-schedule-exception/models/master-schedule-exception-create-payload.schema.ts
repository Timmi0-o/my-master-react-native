import { z } from 'zod'
import { HhMmTimeSchema } from '@/actions/base-models/payload/hh-mm-time.schema'
import { MasterScheduleExceptionKindSchema } from './master-schedule-exception-shared.schema'

export const MasterScheduleExceptionCreatePayloadSchema = z.object({
	masterProfileId: z.string().min(1),
	startsAt: z.string().datetime(),
	endsAt: z.string().datetime(),
	kind: MasterScheduleExceptionKindSchema,
	customStartTime: HhMmTimeSchema.nullable().optional(),
	customEndTime: HhMmTimeSchema.nullable().optional(),
	title: z.string().max(255).nullable().optional(),
	note: z.string().max(5000).nullable().optional(),
})

export type IMasterScheduleExceptionCreatePayload = z.infer<
	typeof MasterScheduleExceptionCreatePayloadSchema
>
