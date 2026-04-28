import { authStore } from '@/configs/auth/auth-store'

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

export const api = async <
	T extends BodyInit | null | undefined | unknown = unknown,
>({
	url,
	params,
	json = true,
	isPublic = false,
}: IApiParams<T>): Promise<Response> => {
	const accessToken = isPublic ? null : await authStore.getAccessToken()

	const res = await fetch(url, buildRequestInit(params, json, accessToken, isPublic))

	if (!isPublic && res.status === 401) {
		const refreshed = await authStore.refreshSession()

		if (!refreshed) {
			await authStore.signOut({ silent: true })
			return res
		}

		return fetch(url, buildRequestInit(params, json, refreshed.accessToken, isPublic))
	}

	return res
}
