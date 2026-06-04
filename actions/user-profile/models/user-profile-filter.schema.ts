import { LimitFilterSchema } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { ListOrderDirSchema } from '@/actions/base-models/filters/filter-fields/base-list-order-dir.schema'
import { PageFilterSchema } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { z } from 'zod'

export const UserProfileGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export const UserProfilesGetManyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum(['id', 'userId', 'displayName', 'rating', 'createdAt', 'updatedAt'])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
})

export type IUserProfileGetOneFilters = z.infer<
	typeof UserProfileGetOneFiltersSchema
>

export type IUserProfilesGetManyFilters = z.infer<
	typeof UserProfilesGetManyFiltersSchema
>
