import { LimitFilterSchema } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { ListOrderDirSchema } from '@/actions/base-models/filters/filter-fields/base-list-order-dir.schema'
import { PageFilterSchema } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { RangeFilterSchema } from '@/actions/base-models/filters/filter-fields/base-range-filter.schema'
import { RequiredIdsFilterSchema } from '@/actions/base-models/filters/filter-fields/base-required-ids-filter.schema'
import { StringFilterSchema } from '@/actions/base-models/filters/filter-fields/base-string-filter.schema'
import { z } from 'zod'

export const MasterServiceReviewFiltersPresetSchema = z.object({
	id: StringFilterSchema.optional(),
	masterServiceId: StringFilterSchema.optional(),
	clientUserId: StringFilterSchema.optional(),
	appointmentId: StringFilterSchema.optional(),
	rating: RangeFilterSchema.optional(),
	createdAt: RangeFilterSchema.optional(),
	updatedAt: RangeFilterSchema.optional(),
	deletedAt: RangeFilterSchema.optional(),
})

export const MasterServiceReviewGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export const MasterServiceReviewsGetManyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum([
			'id',
			'clientUserId',
			'masterServiceId',
			'appointmentId',
			'rating',
			'createdAt',
			'updatedAt',
		])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
	requiredIds: RequiredIdsFilterSchema.optional(),
	filter: MasterServiceReviewFiltersPresetSchema.optional(),
})

export type IMasterServiceReviewFiltersPreset = z.infer<
	typeof MasterServiceReviewFiltersPresetSchema
>

export type IMasterServiceReviewGetOneFilters = z.infer<
	typeof MasterServiceReviewGetOneFiltersSchema
>

export type IMasterServiceReviewsGetManyFilters = z.infer<
	typeof MasterServiceReviewsGetManyFiltersSchema
>
