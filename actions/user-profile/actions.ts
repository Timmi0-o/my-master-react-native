import { API_ROUTES } from '@/constants/api-routes'
import { abstractGetAction } from '@/helpers/action.helper'
import { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import type {
	IUserProfileGetOneFilters,
	IUserProfilesGetManyFilters,
} from './models/user-profile-filter.schema'
import type { IUserProfile } from './models/user-profile.schema'

export const userProfilesGetMany = async (
	options: IGetActionOptions<IUserProfilesGetManyFilters> = {},
): Promise<IActionResponse<IUserProfile[]>> => {
	return abstractGetAction<IUserProfile[], IUserProfilesGetManyFilters>({
		url: API_ROUTES.userProfiles.many,
		params: { method: 'GET' },
		...options,
	})
}

export const userProfilesGetOne = async (
	id: string,
	options: IGetActionOptions<IUserProfileGetOneFilters> = {},
): Promise<IActionResponse<IUserProfile>> => {
	return abstractGetAction<IUserProfile, IUserProfileGetOneFilters>({
		url: API_ROUTES.userProfiles.one(id),
		params: { method: 'GET' },
		...options,
	})
}

export const userProfilesGetMe = async (
	options: IGetActionOptions<IUserProfileGetOneFilters> = {},
): Promise<IActionResponse<IUserProfile | null>> => {
	return abstractGetAction<IUserProfile | null, IUserProfileGetOneFilters>({
		url: API_ROUTES.userProfiles.me,
		params: { method: 'GET' },
		filters: { preset: 'BASE' },
		...options,
	})
}
