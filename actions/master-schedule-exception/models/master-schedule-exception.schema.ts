import { z } from 'zod'
import { MasterScheduleExceptionKindSchema } from './master-schedule-exception-shared.schema'

export { MasterScheduleExceptionKindSchema } from './master-schedule-exception-shared.schema'

export const MasterScheduleExceptionSchema = z.object({
	id: z.string(),
	masterProfileId: z.string(),
	startsAt: z.string(),
	endsAt: z.string(),
	kind: MasterScheduleExceptionKindSchema,
	customStartTime: z.string().nullable().optional(),
	customEndTime: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	note: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
})

export type IMasterScheduleException = z.infer<
	typeof MasterScheduleExceptionSchema
>
export type TMasterScheduleExceptionKind = z.infer<
	typeof MasterScheduleExceptionKindSchema
>
