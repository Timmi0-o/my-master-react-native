import {
	IActionResponse,
	IGetActionOptions,
	IMutateActionOptions,
} from '@/types/i-action.types'
import { api } from './api.helper'
import { ErrorObjectSetup } from './error-object-setup'

export const abstractGetAction = async <T>({
	url,
	params = { method: 'GET' },
	filters,
	customFormatter,
}: IGetActionOptions): Promise<IActionResponse<T>> => {
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
		return errorResult as unknown as IActionResponse<T>
	}

	const data = await res.json()

	if (!data?.result) {
		return { ...data, result: {} } as IActionResponse<T>
	}

	return data as IActionResponse<T>
}

export const abstractMutateAction = async <T, R>({
	url,
	params = { method: 'POST' },
	json = true,
	onOk,
	isPublic = false,
}: IMutateActionOptions<T>): Promise<IActionResponse<R | null>> => {
	const res = await api({ url, params, json, isPublic })

	const errorResult = await ErrorObjectSetup(res)

	if (errorResult?.error) {
		return errorResult as unknown as IActionResponse<R | null>
	}

	onOk?.()

	return res.json()
}

const defaultQueryFormatter = (
	filters: Record<string, unknown>,
): Record<string, string> | undefined => {
	const params: Record<string, string> = {}

	Object.entries(filters).forEach(([key, value]) => {
		if (value === undefined || value === null) return

		if (
			key === 'limit' ||
			key === 'page' ||
			key === 'status' ||
			key === 'search'
		) {
			params[key] = typeof value === 'string' ? value : String(value)
			return
		}

		params[key] = typeof value === 'string' ? value : JSON.stringify(value)
	})

	return Object.keys(params).length > 0 ? params : undefined
}
