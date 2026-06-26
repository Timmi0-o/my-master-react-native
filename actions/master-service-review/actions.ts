import { API_ROUTES } from '@/constants/api-routes'
import {
	abstractGetAction,
	abstractMutateAction,
} from '@/helpers/action.helper'
import type { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type { IMasterServiceReviewCreatePayload } from './models/master-service-review-create-payload.schema'
import type { IMasterServiceReviewUpdatePayload } from './models/master-service-review-update-payload.schema'
import type { IMasterServiceReview } from './models/master-service-review.schema'
import {
	MasterServiceReviewGetOneFiltersSchema,
	MasterServiceReviewsGetManyFiltersSchema,
	type IMasterServiceReviewGetOneFilters,
	type IMasterServiceReviewsGetManyFilters,
} from './models/master-service-review-filter.schema'

export const masterServiceReviewsGetMany = async (
	options: IGetActionOptions<IMasterServiceReviewsGetManyFilters> = {},
): Promise<IActionResponse<IMasterServiceReview[]>> =>
	abstractGetAction<IMasterServiceReview[], IMasterServiceReviewsGetManyFilters>(
		{
			url: API_ROUTES.masterServiceReviews.many,
			params: { method: 'GET' },
			isArray: true,
			isPublic: true,
			...options,
		},
		MasterServiceReviewsGetManyFiltersSchema,
	)

export const masterServiceReviewsGetOne = async (
	id: string,
	options: IGetActionOptions<IMasterServiceReviewGetOneFilters> = {},
): Promise<IActionResponse<IMasterServiceReview>> =>
	abstractGetAction<IMasterServiceReview, IMasterServiceReviewGetOneFilters>(
		{
			url: API_ROUTES.masterServiceReviews.one(id),
			params: { method: 'GET' },
			isPublic: true,
			...options,
		},
		MasterServiceReviewGetOneFiltersSchema,
	)

export const masterServiceReviewsCreate = async (
	payload: IMasterServiceReviewCreatePayload,
): Promise<IActionResponse<IMasterServiceReview | null>> =>
	abstractMutateAction<IMasterServiceReview | null, IMasterServiceReviewCreatePayload>(
		{
			url: API_ROUTES.masterServiceReviews.many,
			params: { method: 'POST', body: payload },
		},
	)

export const masterServiceReviewsUpdate = async (
	id: string,
	payload: IMasterServiceReviewUpdatePayload,
): Promise<IActionResponse<IMasterServiceReview | null>> =>
	abstractMutateAction<IMasterServiceReview | null, IMasterServiceReviewUpdatePayload>(
		{
			url: API_ROUTES.masterServiceReviews.one(id),
			params: { method: 'PATCH', body: payload },
		},
	)

export const masterServiceReviewsDelete = async (
	id: string,
): Promise<IActionResponse<{ success: boolean } | null>> =>
	abstractMutateAction<{ success: boolean } | null>({
		url: API_ROUTES.masterServiceReviews.one(id),
		params: { method: 'DELETE' },
	})
