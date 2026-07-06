import { API_ROUTES } from '@/constants/api-routes'
import {
	abstractGetAction,
	abstractMutateAction,
} from '@/helpers/action.helper'
import type { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type { IMasterServiceAvailableSlots } from './models/master-service-available-slots.schema'
import type {
	IMasterServiceDeleteImagesPayload,
	IMasterServiceDeleteImagesResponse,
} from './models/master-service-delete-images.schema'
import type { IMasterServiceEditPayload } from './models/master-service-edit.schema'
import {
	MasterServiceGetOneFiltersSchema,
	MasterServicesGetManyFiltersSchema,
	MasterServicesGetMyFiltersSchema,
	type IMasterServiceGetOneFilters,
	type IMasterServicesGetManyFilters,
	type IMasterServicesGetMyFilters,
} from './models/master-service-filter.schema'
import type {
	IMasterServicePresignImagesPayload,
	IMasterServicePresignImagesResponse,
} from './models/master-service-presign-images.schema'
import type { IMasterService } from './models/master-service.schema'

export const masterServicesGetMany = async (
	options: IGetActionOptions<IMasterServicesGetManyFilters> = {},
): Promise<IActionResponse<IMasterService[]>> => {
	return abstractGetAction<IMasterService[], IMasterServicesGetManyFilters>(
		{
			url: API_ROUTES.masterServices.many,
			params: { method: 'GET' },
			isArray: true,
			isPublic: true,
			...options,
		},
		MasterServicesGetManyFiltersSchema,
	)
}

export const masterServicesGetMy = async (
	options: IGetActionOptions<IMasterServicesGetMyFilters> = {},
): Promise<IActionResponse<IMasterService[]>> => {
	return abstractGetAction<IMasterService[], IMasterServicesGetMyFilters>(
		{
			url: API_ROUTES.masterServices.my,
			params: { method: 'GET' },
			isArray: true,
			...options,
		},
		MasterServicesGetMyFiltersSchema,
	)
}

export const masterServicesGetOne = async (
	id: string,
	options: IGetActionOptions<IMasterServiceGetOneFilters> = {},
): Promise<IActionResponse<IMasterService>> => {
	return abstractGetAction<IMasterService, IMasterServiceGetOneFilters>(
		{
			url: API_ROUTES.masterServices.one(id),
			params: { method: 'GET' },
			...options,
		},
		MasterServiceGetOneFiltersSchema,
	)
}

export const masterServicesGetAvailableSlots = async (
	id: string,
	options: { date?: string } = {},
): Promise<IActionResponse<IMasterServiceAvailableSlots>> => {
	const params = new URLSearchParams()
	if (options.date) {
		params.set('date', options.date)
	}
	const query = params.toString()
	const url = query
		? `${API_ROUTES.masterServices.availableSlots(id)}?${query}`
		: API_ROUTES.masterServices.availableSlots(id)

	return abstractGetAction<IMasterServiceAvailableSlots>({
		url,
		params: { method: 'GET' },
	})
}

export const masterServicesUpdate = async (
	id: string,
	payload: IMasterServiceEditPayload,
): Promise<IActionResponse<IMasterService | null>> => {
	return abstractMutateAction<IMasterService | null, IMasterServiceEditPayload>(
		{
			url: API_ROUTES.masterServices.one(id),
			params: { method: 'PATCH', body: payload },
		},
	)
}

export const masterServicesNewImageGetPresignUrl = async (
	id: string,
	payload: IMasterServicePresignImagesPayload,
): Promise<IActionResponse<IMasterServicePresignImagesResponse | null>> => {
	return abstractMutateAction<
		IMasterServicePresignImagesResponse | null,
		IMasterServicePresignImagesPayload
	>({
		url: API_ROUTES.masterServices.presignImages(id),
		params: { method: 'POST', body: payload },
	})
}

export const masterServicesDeleteImages = async (
	masterServiceId: string,
	payload: IMasterServiceDeleteImagesPayload,
): Promise<IActionResponse<IMasterServiceDeleteImagesResponse | null>> => {
	return abstractMutateAction<
		IMasterServiceDeleteImagesResponse | null,
		IMasterServiceDeleteImagesPayload
	>({
		url: API_ROUTES.masterServices.deleteImages(masterServiceId),
		params: { method: 'DELETE', body: payload },
	})
}

export const masterServicesDelete = async (
	id: string,
): Promise<IActionResponse<{ success: boolean } | null>> => {
	return abstractMutateAction<{ success: boolean } | null>({
		url: API_ROUTES.masterServices.one(id),
		params: { method: 'DELETE' },
	})
}
