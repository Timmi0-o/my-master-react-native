import { API_ROUTES } from '@/constants/api-routes'
import { abstractGetAction } from '@/helpers/action.helper'
import { listQueryFormatter } from '@/helpers/list-query-formatter'
import { IActionResponse } from '@/types/i-action.types'
import type {
	IMasterProfile,
	IMasterProfileGetManyParams,
} from './models/master-profile.schema'

const DEFAULT_FILTERS: IMasterProfileGetManyParams = {
	preset: 'BASE',
	page: 1,
	limit: 50,
	orderField: 'rating',
	orderDir: 'desc',
}

export const masterProfilesGetMany = async (
	filters?: IMasterProfileGetManyParams,
): Promise<IActionResponse<IMasterProfile[]>> => {
	return abstractGetAction<IMasterProfile[]>({
		url: API_ROUTES.masterProfiles.many,
		params: { method: 'GET' },
		filters: { ...DEFAULT_FILTERS, ...filters },
		customFormatter: listQueryFormatter,
	})
}

/** @deprecated используй masterProfilesGetMany */
export const masterGetMany = masterProfilesGetMany
