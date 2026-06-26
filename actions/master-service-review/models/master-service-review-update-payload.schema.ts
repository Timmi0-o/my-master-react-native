import { z } from 'zod'
import { MasterServiceReviewRatingSchema } from './master-service-review-shared.schema'

export const MasterServiceReviewUpdatePayloadSchema = z.object({
	rating: MasterServiceReviewRatingSchema.optional(),
	text: z.string().min(1).max(2000).optional(),
})

export type IMasterServiceReviewUpdatePayload = z.infer<
	typeof MasterServiceReviewUpdatePayloadSchema
>
