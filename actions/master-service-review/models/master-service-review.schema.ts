import { AppointmentStatusSchema } from '@/actions/appointment/models/appointment.schema'
import { MasterServiceSchema } from '@/actions/master-service/models/master-service.schema'
import { z } from 'zod'
import { MasterServiceReviewRatingSchema } from './master-service-review-shared.schema'

const MasterServiceReviewClientUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string(),
	surname: z.string(),
	patronymic: z.string().nullable().optional(),
})

const MasterServiceReviewAppointmentSchema = z.object({
	id: z.string(),
	masterProfileId: z.string(),
	masterServiceId: z.string(),
	clientUserId: z.string(),
	startsAt: z.string(),
	durationMinutes: z.number(),
	status: AppointmentStatusSchema,
	totalPrice: z.number(),
	serviceName: z.string(),
	cancelledAt: z.string().nullable().optional(),
	cancelReason: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
})

export const MasterServiceReviewSchema = z.object({
	id: z.string(),
	clientUserId: z.string(),
	masterServiceId: z.string(),
	appointmentId: z.string(),
	rating: MasterServiceReviewRatingSchema,
	text: z.string(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	masterService: MasterServiceSchema.optional(),
	clientUser: MasterServiceReviewClientUserSchema.optional(),
	appointment: MasterServiceReviewAppointmentSchema.optional(),
})

export type IMasterServiceReview = z.infer<typeof MasterServiceReviewSchema>
