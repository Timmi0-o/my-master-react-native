import { LimitFilterSchema } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { ListOrderDirSchema } from '@/actions/base-models/filters/filter-fields/base-list-order-dir.schema'
import { PageFilterSchema } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { RangeFilterSchema } from '@/actions/base-models/filters/filter-fields/base-range-filter.schema'
import { RequiredIdsFilterSchema } from '@/actions/base-models/filters/filter-fields/base-required-ids-filter.schema'
import { SearchFilterSchema } from '@/actions/base-models/filters/filter-fields/base-search-filter.schema'
import { StringFilterSchema } from '@/actions/base-models/filters/filter-fields/base-string-filter.schema'
import { AppointmentStatusSchema } from './appointment.schema'
import { z } from 'zod'

const AppointmentStatusFilterSchema = z.object({
	value: z.array(AppointmentStatusSchema),
	mode: z.enum(['OR', 'AND']).optional(),
})

export const AppointmentFiltersPresetSchema = z.object({
	search: SearchFilterSchema.optional(),
	id: StringFilterSchema.optional(),
	masterProfileId: StringFilterSchema.optional(),
	masterServiceId: StringFilterSchema.optional(),
	clientUserId: StringFilterSchema.optional(),
	status: AppointmentStatusFilterSchema.optional(),
	startsAt: RangeFilterSchema.optional(),
	createdAt: RangeFilterSchema.optional(),
	updatedAt: RangeFilterSchema.optional(),
	deletedAt: RangeFilterSchema.optional(),
})

export const AppointmentGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export const AppointmentsGetManyFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
	page: PageFilterSchema,
	limit: LimitFilterSchema,
	orderField: z
		.enum(['id', 'startsAt', 'createdAt', 'status'])
		.optional(),
	orderDir: ListOrderDirSchema.optional(),
	requiredIds: RequiredIdsFilterSchema.optional(),
	filter: AppointmentFiltersPresetSchema.optional(),
})

export type IAppointmentFiltersPreset = z.infer<
	typeof AppointmentFiltersPresetSchema
>

export type IAppointmentGetOneFilters = z.infer<
	typeof AppointmentGetOneFiltersSchema
>

export type IAppointmentsGetManyFilters = z.infer<
	typeof AppointmentsGetManyFiltersSchema
>
