import { IAuthResponse } from '@/actions/auth/models/auth.model'
import { IActionResponse } from '@/types/i-action.types'

const isAuthPayload = (value: unknown): value is IAuthResponse =>
	typeof value === 'object' &&
	value !== null &&
	'tokens' in value &&
	typeof (value as IAuthResponse).tokens.accessToken === 'string'

/** Login: result.data.{user,tokens}; refresh: result.{user,tokens} */
export const getAuthPayloadFromResponse = (
	res: IActionResponse<unknown>,
): IAuthResponse | null => {
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
