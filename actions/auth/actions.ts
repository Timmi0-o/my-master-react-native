import { API_ROUTES } from '@/constants/api-routes'
import { abstractMutateAction } from '@/helpers/action.helper'
import { IActionResponse } from '@/types/i-action.types'
import {
	ILogin,
	ILoginResponse,
	ILogoutRequest,
	ILogoutResponse,
	IRefreshRequest,
	IRefreshResponse,
} from './models/login.schema'
import {
	IResetPasswordRequest,
	ISetNewPassword,
} from './models/resret-password.schema'

export const login = async (
	data: ILogin,
): Promise<IActionResponse<ILoginResponse | null>> => {
	return abstractMutateAction<ILogin, ILoginResponse>({
		url: API_ROUTES.auth.login,
		isPublic: true,
		params: {
			method: 'POST',
			body: {
				email: data.email,
				password: data.password,
			},
		},
	})
}

export const refresh = async (
	payload: IRefreshRequest,
): Promise<IActionResponse<IRefreshResponse | null>> => {
	return abstractMutateAction<IRefreshRequest, IRefreshResponse>({
		url: API_ROUTES.auth.refresh,
		isPublic: true,
		params: {
			method: 'POST',
			body: payload,
		},
	})
}

export const logout = async (
	payload: ILogoutRequest,
): Promise<IActionResponse<ILogoutResponse | null>> => {
	return abstractMutateAction<ILogoutRequest, ILogoutResponse>({
		url: API_ROUTES.auth.logout,
		params: {
			method: 'POST',
			body: payload,
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
