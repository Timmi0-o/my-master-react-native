import { authStore } from '@/stores/auth'
import { parseJwt } from '@/helpers/jwt.helper'

export const getCurrentUserId = async (): Promise<string | null> => {
	const accessToken = await authStore.getAccessToken()
	const payload = parseJwt(accessToken)
	return payload?.sub ?? null
}
