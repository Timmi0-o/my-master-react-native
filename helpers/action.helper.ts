import { IQueryField } from '@/actions/base-models/filters/base-query-field.schema'
import {
	IActionFilters,
	IActionResponse,
	IGetActionOptions,
	IMutateActionOptions,
} from '@/types/i-action.types'
import { api } from './api.helper'
import { ErrorObjectSetup } from './error-object-setup'

export const abstractGetAction = async <
	TData,
	TFilters = Record<string, IQueryField>,
>(
	options: IGetActionOptions<TFilters> & { url: string },
): Promise<IActionResponse<TData>> => {
	const { url, params = { method: 'GET' }, filters, customFormatter } = options

	let finalUrl = url

	if (filters) {
		const formattedParams = customFormatter
			? customFormatter(filters)
			: defaultQueryFormatter(filters)

		if (formattedParams && Object.keys(formattedParams).length > 0) {
			finalUrl += `?${new URLSearchParams(formattedParams)}`
		}
	}

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

const defaultQueryFormatter = <TFilters>(
	filters: IActionFilters<TFilters>,
): Record<string, string> | undefined => {
	const params: Record<string, string> = {}

	Object.entries(filters).forEach(([key, value]) => {
		if (value === undefined || value === null) return

		if (
			key === 'limit' ||
			key === 'page' ||
			key === 'status' ||
			key === 'preset' ||
			key === 'orderField' ||
			key === 'orderDir'
		) {
			params[key] = typeof value === 'string' ? value : String(value)
			return
		}

		params[key] = typeof value === 'string' ? value : JSON.stringify(value)
	})

	return Object.keys(params).length > 0 ? params : undefined
}
