import { z } from 'zod'
import { DayOfWeekSchema } from './master-weekly-schedule-shared.schema'

export { DayOfWeekSchema } from './master-weekly-schedule-shared.schema'

export const MasterWeeklyScheduleSchema = z.object({
	id: z.string(),
	masterProfileId: z.string(),
	dayOfWeek: DayOfWeekSchema,
	startTime: z.string(),
	endTime: z.string(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
})

export type IMasterWeeklySchedule = z.infer<typeof MasterWeeklyScheduleSchema>
export type TDayOfWeek = z.infer<typeof DayOfWeekSchema>
