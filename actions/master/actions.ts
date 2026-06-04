import { API_ROUTES } from '@/constants/api-routes'
import { abstractGetAction } from '@/helpers/action.helper'
import {
	IActionResponse,
	IGetActionOptions,
} from '@/types/i-action.types'
import type { IMasterProfile } from './models/master-profile.schema'
import type {
	IMasterProfileGetOneFilters,
	IMasterProfilesGetManyFilters,
} from './models/master-profile-filter.schema'

export const masterProfilesGetMany = async (
	options: IGetActionOptions<IMasterProfilesGetManyFilters> = {},
): Promise<IActionResponse<IMasterProfile[]>> => {
	return abstractGetAction<IMasterProfile[], IMasterProfilesGetManyFilters>({
		url: API_ROUTES.masterProfiles.many,
		params: { method: 'GET' },
		...options,
	})
}

export const masterProfilesGetOne = async (
	id: string,
	options: IGetActionOptions<IMasterProfileGetOneFilters> = {},
): Promise<IActionResponse<IMasterProfile>> => {
	return abstractGetAction<IMasterProfile, IMasterProfileGetOneFilters>({
		url: API_ROUTES.masterProfiles.one(id),
		params: { method: 'GET' },
		...options,
	})
}

export const masterProfilesGetMe = async (
	options: IGetActionOptions<IMasterProfileGetOneFilters> = {},
): Promise<IActionResponse<IMasterProfile | null>> => {
	return abstractGetAction<IMasterProfile | null, IMasterProfileGetOneFilters>({
		url: API_ROUTES.masterProfiles.me,
		params: { method: 'GET' },
		...options,
	})
}
