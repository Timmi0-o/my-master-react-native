import { API_ROUTES } from '@/constants/api-routes'
import { abstractMutateAction } from '@/helpers/action.helper'
import { IActionResponse } from '@/types/i-action.types'
import { IResetPasswordRequest, ISetNewPassword } from './models/auth.model'
import { ILogin } from './models/login.schema'

export type LoginSuccess = { sid: string; accessToken: string }

export const login = async (
	data: ILogin,
): Promise<IActionResponse<LoginSuccess | null>> => {
	return abstractMutateAction<ILogin, LoginSuccess>({
		url: API_ROUTES.auth.login,
		isPublic: true,
		params: {
			headers: {
				'tourgis-custom-user-source': 'ADMIN',
				'tourgis-custom-user-identity-key': 'ADMIN',
			},
			method: 'POST',
			body: {
				email: data.email,
				password: data.password,
				fingerprint: data.fingerprint,
			},
		},
	})
}

export const logout = async (
	sid: string,
): Promise<IActionResponse<boolean | null>> => {
	return abstractMutateAction<{ sid: string }, boolean>({
		url: API_ROUTES.auth.logout,
		params: {
			method: 'POST',
			body: { sid },
		},
	})
}

export const requestResetPassword = async (
	payload: IResetPasswordRequest,
): Promise<IActionResponse<{ success: boolean; data: boolean } | null>> => {
	return abstractMutateAction<
		{ email: string },
		{ success: boolean; data: boolean }
	>({
		url: API_ROUTES.auth.requestResetPassword,
		isPublic: true,
		params: { method: 'POST', body: { email: payload.email } },
	})
}

export const validateResetPasswordToken = async (
	token: string,
): Promise<IActionResponse<{ success: boolean; data: boolean } | null>> => {
	return abstractMutateAction<
		{ token: string },
		{ success: boolean; data: boolean }
	>({
		url: API_ROUTES.auth.validateResetPasswordToken,
		isPublic: true,
		params: { method: 'POST', body: { token } },
	})
}

export const resetPassword = async (
	payload: ISetNewPassword,
): Promise<IActionResponse<{ success: boolean; data: boolean } | null>> => {
	return abstractMutateAction<
		{ token: string; password: string },
		{ success: boolean; data: boolean }
	>({
		url: API_ROUTES.auth.resetPassword,
		isPublic: true,
		params: {
			method: 'POST',
			body: { token: payload.token, password: payload.password },
		},
	})
}
