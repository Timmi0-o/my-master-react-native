import { GetActionPresetSchema } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'
import { z } from 'zod'

export const AppointmentChatGetOneFiltersSchema = z.object({
	preset: GetActionPresetSchema.optional(),
})

export type IAppointmentChatGetOneFilters = z.infer<
	typeof AppointmentChatGetOneFiltersSchema
>
