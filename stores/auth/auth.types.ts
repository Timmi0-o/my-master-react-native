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
