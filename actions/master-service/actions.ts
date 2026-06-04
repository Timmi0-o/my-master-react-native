import { API_ROUTES } from '@/constants/api-routes'
import { abstractGetAction } from '@/helpers/action.helper'
import {
	IActionResponse,
	IGetActionOptions,
} from '@/types/i-action.types'
import type { IMasterService } from './models/master-service.schema'
import type { IMasterServicesGetManyFilters } from './models/master-service-filter.schema'

export const masterServicesGetMany = async (
	options: IGetActionOptions<IMasterServicesGetManyFilters> = {},
): Promise<IActionResponse<IMasterService[]>> => {
	return abstractGetAction<IMasterService[], IMasterServicesGetManyFilters>({
		url: API_ROUTES.masterServices.many,
		params: { method: 'GET' },
		...options,
	})
}
