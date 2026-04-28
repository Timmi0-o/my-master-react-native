import { login, logout } from '@/actions/auth/actions'
import { ILogin } from '@/actions/auth/models/login.schema'
import { IActionResponse } from '@/types/i-action.types'
import { makeAutoObservable, runInAction } from 'mobx'
import { ReactNode, useEffect } from 'react'
import { authLog } from './auth-logger'
import { authStore, IAuthSession, IAuthState } from './auth-store'

export interface IAuthContextValue {
	state: IAuthState
	signIn: (credentials: ILogin) => Promise<IActionResponse<IAuthSession | null>>
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

		if (res.error || !res.result?.data) {
			return res as IActionResponse<IAuthSession | null>
		}

		const session = await authStore.commitSession({
			accessToken: res.result.data.accessToken,
			sid: res.result.data.sid,
		})

		if (!session) {
			return {
				error: {
					statusCode: 500,
					timestamp: new Date().toISOString(),
					error: 'Invalid Token',
					message: 'Не удалось разобрать токен авторизации',
				},
				result: { data: null },
			}
		}

		return { result: { data: session, success: true } }
	}

	signOut: IAuthContextValue['signOut'] = async () => {
		const sid = this.state.session?.sid
		if (sid) {
			try {
				await logout(sid)
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
