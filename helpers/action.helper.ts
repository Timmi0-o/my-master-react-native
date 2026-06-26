import { EMPTY_DEFAULT_API_RESPONSE } from '@/constants/empty-default-api-response'
import { myMasterEndpointResponseMapper } from '@/contracts/api-response/my-master-api-core'
import { IMyMasterEndpointResponse } from '@/contracts/api-response/my-master-api-core/types/i-my-master-endpoint-response.type'
import { IAppActionResponse } from '@/contracts/api-response/types'
import { createError } from '@/helpers/create-error'
import {
	IGetActionOptions,
	IMutateActionOptions,
} from '@/types/i-action.types'
import { ZodSchema } from 'zod'
import { setQueryFilters } from './actions/utils/set-query-filters.util'
import { api } from './api.helper'
import { ErrorObjectSetup } from './error-object-setup'

export const abstractGetAction = async <TData, TFilters = Record<string, unknown>>(
	options: IGetActionOptions<TFilters> & { url: string },
	queryFilterSchema?: ZodSchema<TFilters>,
): Promise<IAppActionResponse<TData>> => {
	const {
		url,
		params = { method: 'GET' },
		filters,
		customFormatter,
		isArray = false,
		isPublic = false,
	} = options

	if (!url) {
		throw new Error('action URL is required')
	}

	const finalUrl = setQueryFilters<TFilters>(
		url,
		filters,
		queryFilterSchema,
		customFormatter,
	)

	const res = await api({ url: finalUrl, params, isPublic })

	const errorResult = await ErrorObjectSetup(res)

	if (errorResult?.error) {
		if (errorResult.error.statusCode === 404 && isArray) {
			return EMPTY_DEFAULT_API_RESPONSE as IAppActionResponse<TData>
		}
		return errorResult as IAppActionResponse<TData>
	}

	const data = (await res.json()) as IMyMasterEndpointResponse
	const formattedResponseData = myMasterEndpointResponseMapper<TData>(data)

	if (!isArray && !formattedResponseData.result?.data) {
		return {
			result: { data: null },
			error: createError(404, 'Data not found', finalUrl, 'GET'),
		}
	}

	return formattedResponseData
}

export const abstractMutateAction = async <TData, TBody = unknown>({
	url,
	params = { method: 'POST', body: undefined as TBody },
	json = true,
	onOk,
	isPublic = false,
}: IMutateActionOptions<TBody>): Promise<IAppActionResponse<TData>> => {
	const res = await api({ url, params, json, isPublic })

	const errorResult = await ErrorObjectSetup(res)

	if (errorResult?.error) {
		return errorResult as IAppActionResponse<TData>
	}

	onOk?.()

	const data = (await res.json()) as IMyMasterEndpointResponse
	return myMasterEndpointResponseMapper<TData>(data)
}
