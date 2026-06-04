import { LimitFilterSchema } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { ListOrderDirSchema } from '@/actions/base-models/filters/filter-fields/base-list-order-dir.schema'
import { PageFilterSchema } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { RangeFilterSchema } from '@/actions/base-models/filters/filter-fields/base-range-filter.schema'
import { RequiredIdsFilterSchema } from '@/actions/base-models/filters/filter-fields/base-required-ids-filter.schema'
import { StringFilterSchema } from '@/actions/base-models/filters/filter-fields/base-string-filter.schema'
import { z } from 'zod'

export const MasterScheduleExceptionFiltersPresetSchema = z.object({
	id: StringFilterSchema.optional(),
	masterProfileId: StringFilterSchema.optional(),
	kind: StringFilterSchema.optional(),
	startsAt: RangeFilterSchema.optional(),
	endsAt: RangeFilterSchema.optional(),
})

export const MasterScheduleExceptionGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export const MasterScheduleExceptionsGetManyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum(['id', 'masterProfileId', 'startsAt', 'endsAt', 'kind', 'createdAt', 'updatedAt'])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
	requiredIds: RequiredIdsFilterSchema.optional(),
	filter: MasterScheduleExceptionFiltersPresetSchema.optional(),
})

export type IMasterScheduleExceptionFiltersPreset = z.infer<
	typeof MasterScheduleExceptionFiltersPresetSchema
>
export type IMasterScheduleExceptionGetOneFilters = z.infer<
	typeof MasterScheduleExceptionGetOneFiltersSchema
>
export type IMasterScheduleExceptionsGetManyFilters = z.infer<
	typeof MasterScheduleExceptionsGetManyFiltersSchema
>
