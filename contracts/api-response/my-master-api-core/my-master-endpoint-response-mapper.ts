import { IAppActionResponse } from '@/contracts/api-response/types'
import { IApiResponseMapper } from '@/contracts/api-response/types/i-api-response-mapper'
import { IMyMasterEndpointResponse } from './types/i-my-master-endpoint-response.type'

const isObjectWithKeys = (value: unknown): boolean =>
	value !== null &&
	value !== undefined &&
	typeof value === 'object' &&
	Object.keys(value).length > 0

export const myMasterEndpointResponseMapper: IApiResponseMapper<IMyMasterEndpointResponse> =
	<TData>(response: IMyMasterEndpointResponse): IAppActionResponse<TData> => {
		const result = response?.result
		const resultDataValue = result?.data

		const resultData = isObjectWithKeys(resultDataValue)
			? resultDataValue
			: result && isObjectWithKeys(result) && !result.meta
				? result
				: null

		const resultMeta = result?.meta
		const error = response?.error ?? null

		return {
			result: {
				data: resultData as TData | null,
				...(resultMeta && { meta: resultMeta }),
			},
			error: error ?? null,
		}
	}
