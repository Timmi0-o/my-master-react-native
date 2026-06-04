import { z } from 'zod'
import {
	MasterProfileSchema,
	MasterProfileServiceSchema,
} from '@/actions/master/models/master-profile.schema'
import { AppointmentChatSchema } from '@/actions/appointment-chat/models/appointment-chat.schema'

export const AppointmentStatusSchema = z.enum([
	'PENDING',
	'CONFIRMED',
	'CANCELLED',
	'COMPLETED',
	'NO_SHOW',
])

const ClientUserSchema = z.object({
	id: z.string(),
	email: z.string(),
	phone: z.string().nullable().optional(),
	username: z.string(),
	name: z.string(),
	surname: z.string(),
	patronymic: z.string().nullable().optional(),
})

export const AppointmentSchema = z.object({
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
	cancelledBy: z.enum(['CLIENT', 'MASTER', 'STAFF']).nullable().optional(),
	cancelReason: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	masterProfile: MasterProfileSchema.optional(),
	masterService: MasterProfileServiceSchema.optional(),
	clientUser: ClientUserSchema.optional(),
	chat: AppointmentChatSchema.nullable().optional(),
})

export type IAppointment = z.infer<typeof AppointmentSchema>
