import { API_ROUTES } from '@/constants/api-routes'
import { abstractGetAction, abstractMutateAction } from '@/helpers/action.helper'
import type { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type { IAppointmentCreatePayload } from './models/appointment-create-payload.schema'
import type { IAppointment } from './models/appointment.schema'
import {
	AppointmentGetOneFiltersSchema,
	AppointmentsGetManyFiltersSchema,
	type IAppointmentGetOneFilters,
	type IAppointmentsGetManyFilters,
} from './models/appointment-filter.schema'

export const appointmentsGetMyMany = async (
	options: IGetActionOptions<IAppointmentsGetManyFilters> = {},
): Promise<IActionResponse<IAppointment[]>> => {
	return abstractGetAction<IAppointment[], IAppointmentsGetManyFilters>(
		{
			url: API_ROUTES.appointments.me,
			params: { method: 'GET' },
			...options,
		},
		AppointmentsGetManyFiltersSchema,
	)
}

export const appointmentsGetMyClientsMany = async (
	options: IGetActionOptions<IAppointmentsGetManyFilters> = {},
): Promise<IActionResponse<IAppointment[]>> => {
	return abstractGetAction<IAppointment[], IAppointmentsGetManyFilters>(
		{
			url: API_ROUTES.appointments.myClients,
			params: { method: 'GET' },
			...options,
		},
		AppointmentsGetManyFiltersSchema,
	)
}

export const appointmentsGetOne = async (
	id: string,
	options: IGetActionOptions<IAppointmentGetOneFilters> = {},
): Promise<IActionResponse<IAppointment>> => {
	return abstractGetAction<IAppointment, IAppointmentGetOneFilters>(
		{
			url: API_ROUTES.appointments.one(id),
			params: { method: 'GET' },
			...options,
		},
		AppointmentGetOneFiltersSchema,
	)
}

export const appointmentsCreate = async (
	payload: IAppointmentCreatePayload,
): Promise<IActionResponse<IAppointment | null>> => {
	return abstractMutateAction<IAppointment>({
		url: API_ROUTES.appointments.many,
		params: { method: 'POST', body: payload },
	})
}
