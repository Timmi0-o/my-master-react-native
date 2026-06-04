import { masterServicesGetMany } from '@/actions/master-service/actions'
import type { IMasterServicesGetManyFilters } from '@/actions/master-service/models/master-service-filter.schema'
import { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import { IRecommendedService } from './models/service.schema'

export const masterServicesGetRecommended = async (
	options: IGetActionOptions<IMasterServicesGetManyFilters> = {},
): Promise<IActionResponse<IRecommendedService[]>> => {
	return masterServicesGetMany(options)
}

/** @deprecated используй masterServicesGetRecommended */
export const serviceGetRecommendedForYou = masterServicesGetRecommended
