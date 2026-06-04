import { z } from 'zod'
import { AppointmentStatusSchema } from './appointment.schema'

export const AppointmentCreatePayloadSchema = z.object({
	masterProfileId: z.string(),
	masterServiceId: z.string(),
	startsAt: z.string(),
	status: AppointmentStatusSchema.optional(),
	initialMessage: z
		.object({
			body: z.string().min(1).max(10000),
		})
		.optional(),
})

export type IAppointmentCreatePayload = z.infer<
	typeof AppointmentCreatePayloadSchema
>
