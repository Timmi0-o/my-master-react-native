import {
	IActionResponse,
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
): Promise<IActionResponse<TData>> => {
	const {
		url,
		params = { method: 'GET' },
		filters,
		customFormatter,
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

	const res = await api({ url: finalUrl, params })

	const errorResult = await ErrorObjectSetup(res)

	if (errorResult?.error) {
		return errorResult as unknown as IActionResponse<TData>
	}

	const data = await res.json()

	if (!data?.result) {
		return { ...data, result: {} } as IActionResponse<TData>
	}

	return data as IActionResponse<TData>
}

export const abstractMutateAction = async <R>({
	url,
	params = { method: 'POST' },
	json = true,
	onOk,
	isPublic = false,
}: IMutateActionOptions): Promise<IActionResponse<R | null>> => {
	const res = await api({ url, params, json, isPublic })

	const errorResult = await ErrorObjectSetup(res)

	if (errorResult?.error) {
		return errorResult as unknown as IActionResponse<R | null>
	}

	onOk?.()

	return res.json()
}
