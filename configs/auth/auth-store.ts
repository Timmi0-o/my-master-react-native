import { isJWTExpired, parseJwt } from '@/helpers/jwt.helper'
import { refresh } from '@/actions/auth/actions'
import { authLog } from './auth-logger'
import { authStorage, IPersistedSession } from './auth-storage'

const MILLISEC = 1000
const REFRESH_MARGIN_MS = 60_000

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface IAuthSession {
	accessToken: string
	refreshToken: string
	accessTokenExpires: number
}

export interface IAuthStateUnauthenticated {
	status: 'loading' | 'unauthenticated'
	session: null
}

export interface IAuthStateAuthenticated {
	status: 'authenticated'
	session: IAuthSession
}

export type IAuthState = IAuthStateUnauthenticated | IAuthStateAuthenticated

type Listener = (state: IAuthState) => void

const buildSession = (session: IPersistedSession): IAuthSession | null => {
	const payload = parseJwt(session.accessToken)
	if (!payload?.exp) return null
	return {
		accessToken: session.accessToken,
		refreshToken: session.refreshToken,
		accessTokenExpires: payload.exp * MILLISEC,
	}
}

const createAuthStore = () => {
	let state: IAuthState = { status: 'loading', session: null }
	const listeners = new Set<Listener>()
	let hydrationPromise: Promise<void> | null = null
	let inflightRefresh: Promise<IAuthSession | null> | null = null

	const setState = (next: IAuthState) => {
		state = next
		listeners.forEach((l) => l(state))
	}

	const hydrate = async (): Promise<void> => {
		if (hydrationPromise) return hydrationPromise
		hydrationPromise = (async () => {
			try {
				const persisted = await authStorage.read()
				if (!persisted) {
					setState({ status: 'unauthenticated', session: null })
					return
				}
				const session = buildSession(persisted)
				if (!session) {
					await authStorage.clear()
					setState({ status: 'unauthenticated', session: null })
					return
				}
				setState({ status: 'authenticated', session })
				authLog.info('Hydrated session from storage')
			} catch (e) {
				authLog.error('Hydration error', e)
				setState({ status: 'unauthenticated', session: null })
			}
		})()
		return hydrationPromise
	}

	const refreshSession = async (): Promise<IAuthSession | null> => {
		if (inflightRefresh) return inflightRefresh

		const current = state.session
		if (!current?.refreshToken) {
			authLog.warn('Refresh skipped: no refreshToken')
			return null
		}

		inflightRefresh = (async () => {
			try {
				authLog.action('Refresh: start')
				const res = await refresh({ refreshToken: current.refreshToken })
				if (res.error || !res.result?.data?.tokens) {
					authLog.warn(`Refresh failed: ${res.error?.statusCode ?? 'unknown'}`)
					return null
				}
				const next = buildSession({
					accessToken: res.result.data.tokens.accessToken,
					refreshToken: res.result.data.tokens.refreshToken,
				})
				if (!next) {
					authLog.warn('Refresh: invalid token payload')
					return null
				}

				await authStorage.write({
					accessToken: next.accessToken,
					refreshToken: next.refreshToken,
				})
				setState({ status: 'authenticated', session: next })
				authLog.success('Refresh: ok')
				return next
			} catch (e) {
				authLog.error('Refresh error', e)
				return null
			} finally {
				inflightRefresh = null
			}
		})()

		return inflightRefresh
	}

	const getAccessToken = async (): Promise<string | null> => {
		await hydrate()

		const current = state.session
		if (!current) return null

		const expired = isJWTExpired(current.accessTokenExpires, {
			marginMiliSeconds: REFRESH_MARGIN_MS,
		})

		if (!expired) return current.accessToken

		const refreshed = await refreshSession()
		return refreshed?.accessToken ?? null
	}

	const commitSession = async (input: {
		accessToken: string
		refreshToken: string
	}): Promise<IAuthSession | null> => {
		const session = buildSession(input)
		if (!session) {
			authLog.warn('commitSession: invalid token payload')
			return null
		}
		await authStorage.write({
			accessToken: session.accessToken,
			refreshToken: session.refreshToken,
		})
		setState({ status: 'authenticated', session })
		return session
	}

	const signOut = async (
		options?: { silent?: boolean },
	): Promise<void> => {
		try {
			await authStorage.clear()
		} catch (e) {
			authLog.error('signOut: storage clear failed', e)
		}
		setState({ status: 'unauthenticated', session: null })
		if (!options?.silent) authLog.success('Signed out')
	}

	const subscribe = (listener: Listener): (() => void) => {
		listeners.add(listener)
		return () => {
			listeners.delete(listener)
		}
	}

	const getSnapshot = (): IAuthState => state

	return {
		hydrate,
		getSnapshot,
		subscribe,
		getAccessToken,
		refreshSession,
		commitSession,
		signOut,
	}
}

export const authStore = createAuthStore()
