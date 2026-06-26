import { z } from 'zod'
import { MasterServiceReviewRatingSchema } from './master-service-review-shared.schema'

export const MasterServiceReviewCreatePayloadSchema = z.object({
	appointmentId: z.string().min(1),
	rating: MasterServiceReviewRatingSchema,
	text: z.string().min(1).max(2000),
})

export type IMasterServiceReviewCreatePayload = z.infer<
	typeof MasterServiceReviewCreatePayloadSchema
>
