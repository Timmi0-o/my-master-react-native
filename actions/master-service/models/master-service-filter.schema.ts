import { LimitFilterSchema } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { ListOrderDirSchema } from '@/actions/base-models/filters/filter-fields/base-list-order-dir.schema'
import { PageFilterSchema } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { RequiredIdsFilterSchema } from '@/actions/base-models/filters/filter-fields/base-required-ids-filter.schema'
import { SearchFilterSchema } from '@/actions/base-models/filters/filter-fields/base-search-filter.schema'
import { z } from 'zod'

export const MasterServiceGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export const MasterServicesGetManyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum(['id', 'name', 'price', 'masterProfileId', 'createdAt', 'updatedAt'])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
	search: SearchFilterSchema.optional(),
	requiredIds: RequiredIdsFilterSchema.optional(),
})

export type IMasterServiceGetOneFilters = z.infer<
	typeof MasterServiceGetOneFiltersSchema
>

export type IMasterServicesGetManyFilters = z.infer<
	typeof MasterServicesGetManyFiltersSchema
>

export const MasterServicesGetMyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum(['id', 'name', 'price', 'createdAt', 'updatedAt'])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
	search: SearchFilterSchema.optional(),
	requiredIds: RequiredIdsFilterSchema.optional(),
})

export type IMasterServicesGetMyFilters = z.infer<
	typeof MasterServicesGetMyFiltersSchema
>
