import { login, logout, refresh, register } from '@/actions/auth/actions'
import type { ILogin, IRegister } from '@/actions/auth/models/login.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { getAuthPayloadFromResponse } from '@/helpers/auth-response.helper'
import { isJWTExpired, parseJwt } from '@/helpers/jwt.helper'
import type { IActionResponse } from '@/types/i-action.types'
import { makeAutoObservable, runInAction } from 'mobx'
import { authLog } from './auth-logger'
import { authStorage, type IPersistedSession } from './auth-storage'
import type { IAuthSession, IAuthState } from './auth.types'

const MILLISEC = 1000
const REFRESH_MARGIN_MS = 60_000

const buildSession = (session: IPersistedSession): IAuthSession | null => {
	const payload = parseJwt(session.accessToken)

	if (!payload?.exp) return null

	return {
		accessToken: session.accessToken,
		refreshToken: session.refreshToken,
		accessTokenExpires: payload.exp * MILLISEC,
	}
}

export class AuthStore {
	state: IAuthState = { status: 'loading', session: null }

	private hydrationPromise: Promise<void> | null = null

	private inflightRefresh: Promise<IAuthSession | null> | null = null

	constructor() {
		makeAutoObservable<AuthStore, 'hydrationPromise' | 'inflightRefresh'>(
			this,
			{
				hydrationPromise: false,
				inflightRefresh: false,
			},
			{ autoBind: true },
		)
	}

	get isLoading(): boolean {
		return this.state.status === 'loading'
	}

	get isAuthenticated(): boolean {
		return this.state.status === 'authenticated'
	}

	get session(): IAuthSession | null {
		return this.state.status === 'authenticated' ? this.state.session : null
	}

	get user(): IAuthSession | null {
		return this.session
	}

	hydrate = async (): Promise<void> => {
		if (this.hydrationPromise) return this.hydrationPromise

		this.hydrationPromise = (async () => {
			try {
				const persisted = await authStorage.read()
				if (!persisted) {
					runInAction(() => {
						this.state = { status: 'unauthenticated', session: null }
					})
					return
				}

				const session = buildSession(persisted)
				if (!session) {
					await authStorage.clear()
					runInAction(() => {
						this.state = { status: 'unauthenticated', session: null }
					})
					return
				}

				runInAction(() => {
					this.state = { status: 'authenticated', session }
				})
				authLog.info('Hydrated session from storage')
			} catch (error) {
				authLog.error('Hydration error', error)
				runInAction(() => {
					this.state = { status: 'unauthenticated', session: null }
				})
			}
		})()

		return this.hydrationPromise
	}

	refreshSession = async (): Promise<IAuthSession | null> => {
		if (this.inflightRefresh) return this.inflightRefresh

		const current = this.session
		if (!current?.refreshToken) {
			authLog.warn('Refresh skipped: no refreshToken')
			return null
		}

		this.inflightRefresh = (async () => {
			try {
				authLog.action('Refresh: start')
				const res = await refresh({ refreshToken: current.refreshToken })
				const authPayload = getAuthPayloadFromResponse(res)
				if (!authPayload?.tokens) {
					authLog.warn(`Refresh failed: ${res.error?.statusCode ?? 'unknown'}`)
					return null
				}

				const next = buildSession({
					accessToken: authPayload.tokens.accessToken,
					refreshToken: authPayload.tokens.refreshToken,
				})
				if (!next) {
					authLog.warn('Refresh: invalid token payload')
					return null
				}

				await authStorage.write({
					accessToken: next.accessToken,
					refreshToken: next.refreshToken,
				})
				runInAction(() => {
					this.state = { status: 'authenticated', session: next }
				})
				authLog.success('Refresh: ok')
				return next
			} catch (error) {
				authLog.error('Refresh error', error)
				return null
			} finally {
				this.inflightRefresh = null
			}
		})()

		return this.inflightRefresh
	}

	getAccessToken = async (): Promise<string | null> => {
		await this.hydrate()

		const current = this.session
		if (!current) return null

		const expired = isJWTExpired(current.accessTokenExpires, {
			marginMiliSeconds: REFRESH_MARGIN_MS,
		})

		if (!expired) return current.accessToken

		const refreshed = await this.refreshSession()
		return refreshed?.accessToken ?? null
	}

	commitSession = async (input: {
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
		runInAction(() => {
			this.state = { status: 'authenticated', session }
		})
		return session
	}

	signIn = async (
		credentials: ILogin,
	): Promise<IActionResponse<IAuthSession | null>> => {
		const res = await login(credentials)
		const authPayload = getAuthPayloadFromResponse(res)
		if (!authPayload?.tokens) {
			return res as IActionResponse<IAuthSession | null>
		}

		const session = await this.commitSession({
			accessToken: authPayload.tokens.accessToken,
			refreshToken: authPayload.tokens.refreshToken,
		})

		if (!session) {
			return {
				error: {
					statusCode: 500,
					timestamp: new Date().toISOString(),
					message: scopedT('authTokenParse', 'common', 'errors'),
				},
				result: { data: null },
			}
		}

		return { result: { data: session }, error: null }
	}

	signUp = async (
		credentials: IRegister,
	): Promise<IActionResponse<IAuthSession | null>> => {
		const res = await register(credentials)
		const authPayload = getAuthPayloadFromResponse(res)
		if (!authPayload?.tokens) {
			return res as IActionResponse<IAuthSession | null>
		}

		const session = await this.commitSession({
			accessToken: authPayload.tokens.accessToken,
			refreshToken: authPayload.tokens.refreshToken,
		})

		if (!session) {
			return {
				error: {
					statusCode: 500,
					timestamp: new Date().toISOString(),
					message: scopedT('authTokenParse', 'common', 'errors'),
				},
				result: { data: null },
			}
		}

		return { result: { data: session }, error: null }
	}

	signOut = async (options?: { silent?: boolean }): Promise<void> => {
		const refreshToken = this.session?.refreshToken
		if (refreshToken && !options?.silent) {
			try {
				await logout({ refreshToken })
			} catch (error) {
				authLog.warn('Server logout failed, clearing locally', error)
			}
		}

		try {
			await authStorage.clear()
		} catch (error) {
			authLog.error('signOut: storage clear failed', error)
		}

		runInAction(() => {
			this.state = { status: 'unauthenticated', session: null }
		})

		if (!options?.silent) authLog.success('Signed out')
	}
}

export const authStore = new AuthStore()
