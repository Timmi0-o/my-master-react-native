import { z } from 'zod'

export const MasterBookingStatusSchema = z.enum([
	'ACCEPTING',
	'PAUSED',
	'CLOSED',
])

export const MasterProfileServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	price: z.number().optional(),
	durationMinutes: z.number().optional(),
	masterProfileId: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
})

export const MasterProfileSchema = z.object({
	id: z.string(),
	userId: z.string(),
	displayName: z.string(),
	description: z.string(),
	rating: z.number(),
	timezone: z.string().optional(),
	bookingStatus: MasterBookingStatusSchema.optional(),
	pausedUntil: z.string().nullable().optional(),
	minNoticeMinutes: z.number().optional(),
	maxBookingDaysAhead: z.number().optional(),
	slotStepMinutes: z.number().optional(),
	bufferBetweenAppointmentsMinutes: z.number().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	services: z.array(MasterProfileServiceSchema).optional(),
})

export type IMasterProfile = z.infer<typeof MasterProfileSchema>
export type IMasterProfileService = z.infer<typeof MasterProfileServiceSchema>
export type TMasterBookingStatus = z.infer<typeof MasterBookingStatusSchema>
