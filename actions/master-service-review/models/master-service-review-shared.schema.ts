import { z } from 'zod'

export const MASTER_SERVICE_REVIEW_MIN_RATING = 1
export const MASTER_SERVICE_REVIEW_MAX_RATING = 5

export const MasterServiceReviewRatingSchema = z
	.number()
	.int()
	.min(MASTER_SERVICE_REVIEW_MIN_RATING)
	.max(MASTER_SERVICE_REVIEW_MAX_RATING)
