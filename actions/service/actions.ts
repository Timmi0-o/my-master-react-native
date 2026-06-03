import { masterServicesGetMany } from '@/actions/master-service/actions'
import { IActionResponse } from '@/types/i-action.types'
import { IRecommendedService } from './models/service.schema'

export const masterServicesGetRecommended = async (): Promise<
	IActionResponse<IRecommendedService[]>
> => {
	return masterServicesGetMany({
		preset: 'BASE',
		page: 1,
		limit: 50,
		orderField: 'price',
		orderDir: 'desc',
	})
}

/** @deprecated используй masterServicesGetRecommended */
export const serviceGetRecommendedForYou = masterServicesGetRecommended
