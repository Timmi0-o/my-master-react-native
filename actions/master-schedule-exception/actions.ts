import { API_ROUTES } from '@/constants/api-routes'
import {
	abstractGetAction,
	abstractMutateAction,
} from '@/helpers/action.helper'
import type { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type { IMasterScheduleExceptionCreatePayload } from './models/master-schedule-exception-create-payload.schema'
import type { IMasterScheduleExceptionUpdatePayload } from './models/master-schedule-exception-update-payload.schema'
import type { IMasterScheduleException } from './models/master-schedule-exception.schema'
import type {
	IMasterScheduleExceptionGetOneFilters,
	IMasterScheduleExceptionsGetManyFilters,
} from './models/master-schedule-exception-filter.schema'

export const masterScheduleExceptionsGetMany = async (
	options: IGetActionOptions<IMasterScheduleExceptionsGetManyFilters> = {},
): Promise<IActionResponse<IMasterScheduleException[]>> => {
	return abstractGetAction<
		IMasterScheduleException[],
		IMasterScheduleExceptionsGetManyFilters
	>({
		url: API_ROUTES.masterScheduleExceptions.many,
		params: { method: 'GET' },
		...options,
	})
}

export const masterScheduleExceptionsGetOne = async (
	id: string,
	options: IGetActionOptions<IMasterScheduleExceptionGetOneFilters> = {},
): Promise<IActionResponse<IMasterScheduleException>> => {
	return abstractGetAction<
		IMasterScheduleException,
		IMasterScheduleExceptionGetOneFilters
	>({
		url: API_ROUTES.masterScheduleExceptions.one(id),
		params: { method: 'GET' },
		...options,
	})
}

export const masterScheduleExceptionsCreate = async (
	payload: IMasterScheduleExceptionCreatePayload,
): Promise<IActionResponse<IMasterScheduleException | null>> => {
	return abstractMutateAction<IMasterScheduleException>({
		url: API_ROUTES.masterScheduleExceptions.many,
		params: { method: 'POST', body: payload },
	})
}

export const masterScheduleExceptionsUpdate = async (
	id: string,
	payload: IMasterScheduleExceptionUpdatePayload,
): Promise<IActionResponse<IMasterScheduleException | null>> => {
	return abstractMutateAction<IMasterScheduleException>({
		url: API_ROUTES.masterScheduleExceptions.one(id),
		params: { method: 'PATCH', body: payload },
	})
}

export const masterScheduleExceptionsDelete = async (
	id: string,
): Promise<IActionResponse<{ success: boolean } | null>> => {
	return abstractMutateAction<{ success: boolean }>({
		url: API_ROUTES.masterScheduleExceptions.one(id),
		params: { method: 'DELETE' },
	})
}
