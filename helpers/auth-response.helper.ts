import { ILoginResponse } from '@/actions/auth/models/login.schema'
import { IActionResponse } from '@/types/i-action.types'

const isAuthPayload = (value: unknown): value is ILoginResponse =>
	typeof value === 'object' &&
	value !== null &&
	'tokens' in value &&
	typeof (value as ILoginResponse).tokens.accessToken === 'string'

/** Login: result.data.{user,tokens}; refresh: result.{user,tokens} */
export const getAuthPayloadFromResponse = (
	res: IActionResponse<unknown>,
): ILoginResponse | null => {
	if (res.error) return null

	const result = res.result
	if (!result || typeof result !== 'object') return null

	if ('data' in result && isAuthPayload(result.data)) {
		return result.data
	}

	if (isAuthPayload(result)) {
		return result
	}

	return null
}
