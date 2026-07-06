import { authStore } from './auth.store'

export { AuthProvider } from '../../components/providers/auth-provider'
export { authStore } from './auth.store'
export type {
	AuthStatus,
	IAuthSession,
	IAuthState,
	IAuthStateAuthenticated,
	IAuthStateUnauthenticated,
} from './auth.types'

export const useAuth = () => authStore
