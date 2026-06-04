import { API_ROUTES } from '@/constants/api-routes'
import { abstractGetAction } from '@/helpers/action.helper'
import type { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type { IAppointment } from './models/appointment.schema'
import type { IAppointmentsGetManyFilters } from './models/appointment-filter.schema'

export const appointmentsGetMyMany = async (
	options: IGetActionOptions<IAppointmentsGetManyFilters> = {},
): Promise<IActionResponse<IAppointment[]>> => {
	return abstractGetAction<IAppointment[], IAppointmentsGetManyFilters>({
		url: API_ROUTES.appointments.me,
		params: { method: 'GET' },
		...options,
	})
}

export const appointmentsGetMyClientsMany = async (
	options: IGetActionOptions<IAppointmentsGetManyFilters> = {},
): Promise<IActionResponse<IAppointment[]>> => {
	return abstractGetAction<IAppointment[], IAppointmentsGetManyFilters>({
		url: API_ROUTES.appointments.myClients,
		params: { method: 'GET' },
		...options,
	})
}
