import { LimitFilterSchema } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { ListOrderDirSchema } from '@/actions/base-models/filters/filter-fields/base-list-order-dir.schema'
import { PageFilterSchema } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { RequiredIdsFilterSchema } from '@/actions/base-models/filters/filter-fields/base-required-ids-filter.schema'
import { StringFilterSchema } from '@/actions/base-models/filters/filter-fields/base-string-filter.schema'
import { z } from 'zod'

export const MasterWeeklyScheduleFiltersPresetSchema = z.object({
	id: StringFilterSchema.optional(),
	masterProfileId: StringFilterSchema.optional(),
	dayOfWeek: StringFilterSchema.optional(),
	startTime: StringFilterSchema.optional(),
	endTime: StringFilterSchema.optional(),
})

export const MasterWeeklyScheduleGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export const MasterWeeklySchedulesGetManyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum([
			'id',
			'masterProfileId',
			'dayOfWeek',
			'startTime',
			'endTime',
			'createdAt',
			'updatedAt',
		])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
	requiredIds: RequiredIdsFilterSchema.optional(),
	filter: MasterWeeklyScheduleFiltersPresetSchema.optional(),
})

export type IMasterWeeklyScheduleFiltersPreset = z.infer<
	typeof MasterWeeklyScheduleFiltersPresetSchema
>
export type IMasterWeeklyScheduleGetOneFilters = z.infer<
	typeof MasterWeeklyScheduleGetOneFiltersSchema
>
export type IMasterWeeklySchedulesGetManyFilters = z.infer<
	typeof MasterWeeklySchedulesGetManyFiltersSchema
>
