import { LimitFilterSchema } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { ListOrderDirSchema } from '@/actions/base-models/filters/filter-fields/base-list-order-dir.schema'
import { PageFilterSchema } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { RequiredIdsFilterSchema } from '@/actions/base-models/filters/filter-fields/base-required-ids-filter.schema'
import { SearchFilterSchema } from '@/actions/base-models/filters/filter-fields/base-search-filter.schema'
import { z } from 'zod'

export const MasterProfileGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export const MasterProfilesGetManyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum(['id', 'userId', 'displayName', 'rating', 'createdAt', 'updatedAt'])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
	requiredIds: RequiredIdsFilterSchema.optional(),
	filter: z
		.object({
			search: SearchFilterSchema.optional(),
		})
		.optional(),
})

export type IMasterProfileGetOneFilters = z.infer<
	typeof MasterProfileGetOneFiltersSchema
>

export type IMasterProfilesGetManyFilters = z.infer<
	typeof MasterProfilesGetManyFiltersSchema
>
