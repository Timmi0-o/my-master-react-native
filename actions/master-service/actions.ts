import { API_ROUTES } from '@/constants/api-routes'
import { abstractGetAction } from '@/helpers/action.helper'
import { listQueryFormatter } from '@/helpers/list-query-formatter'
import { IActionResponse } from '@/types/i-action.types'
import type {
	IMasterService,
	IMasterServiceGetManyParams,
} from './models/master-service.schema'

const DEFAULT_FILTERS: IMasterServiceGetManyParams = {
	preset: 'BASE',
	page: 1,
	limit: 50,
	orderField: 'createdAt',
	orderDir: 'desc',
}

export const masterServicesGetMany = async (
	filters?: IMasterServiceGetManyParams,
): Promise<IActionResponse<IMasterService[]>> => {
	return abstractGetAction<IMasterService[]>({
		url: API_ROUTES.masterServices.many,
		params: { method: 'GET' },
		filters: { ...DEFAULT_FILTERS, ...filters },
		customFormatter: listQueryFormatter,
	})
}
