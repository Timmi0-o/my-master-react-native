export interface IJwtPayload {
	exp: number
	sub: number
	role?: number
	systemRole?: string
	status?: string
	iat?: number
	orgId?: string
	organizationId?: string
}

export const isJWTExpired = (
	expirationTimestampMiliSeconds: number | null,
	options?: { marginMiliSeconds?: number },
): boolean => {
	if (expirationTimestampMiliSeconds === null) return true

	const margin = options?.marginMiliSeconds ?? 0
	const nowMiliSeconds = Date.now()

	const nowMillisecWithMargin = nowMiliSeconds + margin

	return expirationTimestampMiliSeconds <= nowMillisecWithMargin
}

const base64UrlDecode = (input: string): string => {
	const padded = input
		.replace(/-/g, '+')
		.replace(/_/g, '/')
		.padEnd(Math.ceil(input.length / 4) * 4, '=')

	if (typeof globalThis.atob === 'function') {
		return globalThis.atob(padded)
	}

	throw new Error('Base64 decoder is unavailable in current runtime')
}

export function parseJwt(token: null | string): IJwtPayload | null {
	if (!token) return null

	try {
		const [, payload] = token.split('.')
		if (!payload) return null
		return JSON.parse(base64UrlDecode(payload))
	} catch {
		return null
	}
}
