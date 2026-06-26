import { z } from 'zod'

export const SessionUserSchema = z.object({
	id: z.string(),
	email: z.string(),
	username: z.string(),
	role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']),
	status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED']),
})

export type ISessionUser = z.infer<typeof SessionUserSchema>

export const TokenPairSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

export const AuthResponseSchema = z.object({
	user: SessionUserSchema,
	tokens: TokenPairSchema,
})

export type IAuthResponse = z.infer<typeof AuthResponseSchema>

/** @deprecated Use IAuthResponse */
export type ILoginResponse = IAuthResponse

/** @deprecated Use IAuthResponse */
export type IRefreshResponse = IAuthResponse

export const RefreshRequestSchema = z.object({
	refreshToken: z.string(),
})

export type IRefreshRequest = z.infer<typeof RefreshRequestSchema>

export const LogoutRequestSchema = z.object({
	refreshToken: z.string(),
})

export type ILogoutRequest = z.infer<typeof LogoutRequestSchema>

export type ILogoutResponse = { success: boolean }
