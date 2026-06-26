import { login, logout, register } from '@/actions/auth/actions'
import { ILogin, IRegister } from '@/actions/auth/models/login.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { getAuthPayloadFromResponse } from '@/helpers/auth-response.helper'
import { IActionResponse } from '@/types/i-action.types'
import { makeAutoObservable, runInAction } from 'mobx'
import { ReactNode, useEffect } from 'react'
import { authLog } from './auth-logger'
import { authStore, IAuthSession, IAuthState } from './auth-store'

export interface IAuthContextValue {
	state: IAuthState
	signIn: (credentials: ILogin) => Promise<IActionResponse<IAuthSession | null>>
	signUp: (credentials: IRegister) => Promise<IActionResponse<IAuthSession | null>>
	signOut: () => Promise<void>
}

class AuthContextStore implements IAuthContextValue {
	state: IAuthState = authStore.getSnapshot()

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		authStore.subscribe((next) => {
			runInAction(() => {
				this.state = next
			})
		})
	}

	hydrate = async (): Promise<void> => {
		await authStore.hydrate()
	}

	signIn: IAuthContextValue['signIn'] = async (credentials) => {
		const res = await login(credentials)

		const authPayload = getAuthPayloadFromResponse(res)
		if (!authPayload?.tokens) {
			return res as IActionResponse<IAuthSession | null>
		}

		const session = await authStore.commitSession({
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

	signUp: IAuthContextValue['signUp'] = async (credentials) => {
		const res = await register(credentials)

		const authPayload = getAuthPayloadFromResponse(res)
		if (!authPayload?.tokens) {
			return res as IActionResponse<IAuthSession | null>
		}

		const session = await authStore.commitSession({
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

	signOut: IAuthContextValue['signOut'] = async () => {
		const refreshToken = this.state.session?.refreshToken
		if (refreshToken) {
			try {
				await logout({ refreshToken })
			} catch (e) {
				authLog.warn('Server logout failed, clearing locally', e)
			}
		}
		await authStore.signOut()
	}
}

export const authContextStore = new AuthContextStore()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		authContextStore.hydrate().catch(() => {})
	}, [])

	return children
}

export const useAuth = (): IAuthContextValue => authContextStore
