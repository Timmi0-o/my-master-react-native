import { z } from 'zod'
import { MasterBookingStatusSchema } from './master-profile.schema'

export const MasterProfileUpdatePayloadSchema = z.object({
	displayName: z.string().min(1).max(255).optional(),
	description: z.string().min(1).max(5000).optional(),
	rating: z.number().min(0).optional(),
	timezone: z.string().min(1).max(64).optional(),
	bookingStatus: MasterBookingStatusSchema.optional(),
	pausedUntil: z.string().datetime().nullable().optional(),
	minNoticeMinutes: z.number().int().min(0).max(10080).optional(),
	maxBookingDaysAhead: z.number().int().min(1).max(365).optional(),
	slotStepMinutes: z.number().int().min(5).max(120).optional(),
	bufferBetweenAppointmentsMinutes: z.number().int().min(0).max(240).optional(),
})

export type IMasterProfileUpdatePayload = z.infer<
	typeof MasterProfileUpdatePayloadSchema
>
