import { authStore } from '@/stores/auth'

export interface IHttpParams<
	T extends BodyInit | null | undefined | unknown = unknown,
> {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	headers?: Record<string, string>
	body?: T
}

export interface IApiParams<
	T extends BodyInit | null | undefined | unknown = unknown,
> {
	url: string
	params: IHttpParams<T>
	json?: boolean
	isPublic?: boolean
}

const API_REQUEST_TIMEOUT_MS = 15_000

const buildRequestInit = <T>(
	params: IHttpParams<T>,
	json: boolean,
	accessToken: string | null,
	isPublic: boolean,
): RequestInit => {
	const baseHeaders: Record<string, string> = {
		...(params.headers || {}),
		...(!isPublic && accessToken
			? { Authorization: `Bearer ${accessToken}` }
			: {}),
	}

	if (json) {
		const stringifiedBody =
			params.body !== undefined && params.body !== null
				? JSON.stringify(params.body)
				: undefined

		return {
			method: params.method,
			headers: {
				...baseHeaders,
				...(stringifiedBody ? { 'Content-Type': 'application/json' } : {}),
			},
			...(stringifiedBody ? { body: stringifiedBody } : {}),
		}
	}

	return {
		method: params.method,
		headers: baseHeaders,
		body: params.body as BodyInit | null | undefined,
	}
}

const fetchWithTimeout = async (
	url: string,
	init: RequestInit,
	timeoutMs = API_REQUEST_TIMEOUT_MS,
): Promise<Response> => {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

	try {
		return await fetch(url, { ...init, signal: controller.signal })
	} finally {
		clearTimeout(timeoutId)
	}
}

export const api = async <
	T extends BodyInit | null | undefined | unknown = unknown,
>({
	url,
	params,
	json = true,
	isPublic = false,
}: IApiParams<T>): Promise<Response> => {
	const accessToken = isPublic ? null : await authStore.getAccessToken()
	const initialInit = buildRequestInit(params, json, accessToken, isPublic)
	const res = await fetchWithTimeout(url, initialInit)

	if (!isPublic && res.status === 401) {
		const refreshed = await authStore.refreshSession()

		if (!refreshed) {
			await authStore.signOut({ silent: true })
			return res
		}

		const retryInit = buildRequestInit(
			params,
			json,
			refreshed.accessToken,
			isPublic,
		)
		return fetchWithTimeout(url, retryInit)
	}

	return res
}
