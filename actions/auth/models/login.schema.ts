import { z } from 'zod'

export const IAuthTokensSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

export const IAuthSessionUserSchema = z.object({
	id: z.string(),
	email: z.string(),
	username: z.string(),
	role: z.string(),
	status: z.string(),
})

export const LoginSchema = z.object({
	identifier: z.string().min(1, 'Введите email или username'),
	password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
})

export const LoginResponseSchema = z.object({
	user: IAuthSessionUserSchema,
	tokens: IAuthTokensSchema,
})

export const RefreshRequestSchema = z.object({
	refreshToken: z.string(),
})

export const LogoutRequestSchema = z.object({
	refreshToken: z.string(),
})

export const LogoutResponseSchema = z.object({
	success: z.boolean(),
})

export type ILogin = z.infer<typeof LoginSchema>
export type ILoginResponse = z.infer<typeof LoginResponseSchema>
export type IRefreshRequest = z.infer<typeof RefreshRequestSchema>
export type IRefreshResponse = ILoginResponse
export type ILogoutRequest = z.infer<typeof LogoutRequestSchema>
export type ILogoutResponse = z.infer<typeof LogoutResponseSchema>
