import { API_ROUTES } from '@/constants/api-routes'
import {
	abstractGetAction,
	abstractMutateAction,
} from '@/helpers/action.helper'
import type { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type { IMasterWeeklyScheduleCreatePayload } from './models/master-weekly-schedule-create-payload.schema'
import type { IMasterWeeklyScheduleUpdatePayload } from './models/master-weekly-schedule-update-payload.schema'
import type { IMasterWeeklySchedule } from './models/master-weekly-schedule.schema'
import {
	MasterWeeklyScheduleGetOneFiltersSchema,
	MasterWeeklySchedulesGetManyFiltersSchema,
	type IMasterWeeklyScheduleGetOneFilters,
	type IMasterWeeklySchedulesGetManyFilters,
} from './models/master-weekly-schedule-filter.schema'

export const masterWeeklySchedulesGetMany = async (
	options: IGetActionOptions<IMasterWeeklySchedulesGetManyFilters> = {},
): Promise<IActionResponse<IMasterWeeklySchedule[]>> => {
	return abstractGetAction<
		IMasterWeeklySchedule[],
		IMasterWeeklySchedulesGetManyFilters
	>(
		{
			url: API_ROUTES.masterWeeklySchedules.many,
			params: { method: 'GET' },
			...options,
		},
		MasterWeeklySchedulesGetManyFiltersSchema,
	)
}

export const masterWeeklySchedulesGetOne = async (
	id: string,
	options: IGetActionOptions<IMasterWeeklyScheduleGetOneFilters> = {},
): Promise<IActionResponse<IMasterWeeklySchedule>> => {
	return abstractGetAction<
		IMasterWeeklySchedule,
		IMasterWeeklyScheduleGetOneFilters
	>(
		{
			url: API_ROUTES.masterWeeklySchedules.one(id),
			params: { method: 'GET' },
			...options,
		},
		MasterWeeklyScheduleGetOneFiltersSchema,
	)
}

export const masterWeeklySchedulesCreate = async (
	payload: IMasterWeeklyScheduleCreatePayload,
): Promise<IActionResponse<IMasterWeeklySchedule | null>> => {
	return abstractMutateAction<IMasterWeeklySchedule>({
		url: API_ROUTES.masterWeeklySchedules.many,
		params: { method: 'POST', body: payload },
	})
}

export const masterWeeklySchedulesUpdate = async (
	id: string,
	payload: IMasterWeeklyScheduleUpdatePayload,
): Promise<IActionResponse<IMasterWeeklySchedule | null>> => {
	return abstractMutateAction<IMasterWeeklySchedule>({
		url: API_ROUTES.masterWeeklySchedules.one(id),
		params: { method: 'PATCH', body: payload },
	})
}

export const masterWeeklySchedulesDelete = async (
	id: string,
): Promise<IActionResponse<{ success: boolean } | null>> => {
	return abstractMutateAction<{ success: boolean }>({
		url: API_ROUTES.masterWeeklySchedules.one(id),
		params: { method: 'DELETE' },
	})
}
