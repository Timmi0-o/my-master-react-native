import { API_ROUTES } from '@/constants/api-routes'
import { abstractMutateAction } from '@/helpers/action.helper'
import { IActionResponse } from '@/types/i-action.types'
import {
	ILogin,
	IRegister,
} from './models/login.schema'
import {
	IAuthResponse,
	ILogoutRequest,
	ILogoutResponse,
	IRefreshRequest,
} from './models/auth.model'
import {
	IResetPasswordRequest,
	ISetNewPassword,
} from './models/resret-password.schema'

export const login = async (
	data: ILogin,
): Promise<IActionResponse<IAuthResponse | null>> => {
	return abstractMutateAction<IAuthResponse, ILogin>({
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
): Promise<IActionResponse<IAuthResponse | null>> => {
	return abstractMutateAction<IAuthResponse, IRefreshRequest>({
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
	return abstractMutateAction<ILogoutResponse, ILogoutRequest>({
		url: API_ROUTES.auth.logout,
		params: {
			method: 'POST',
			body: payload,
		},
	})
}

export const register = async (
	data: IRegister,
): Promise<IActionResponse<IAuthResponse | null>> => {
	return abstractMutateAction<IAuthResponse, IRegister>({
		url: API_ROUTES.auth.register,
		isPublic: true,
		params: {
			method: 'POST',
			body: data,
		},
	})
}

export const requestResetPassword = async (
	payload: IResetPasswordRequest,
): Promise<IActionResponse<{ success: boolean; data: boolean } | null>> => {
	return abstractMutateAction<
		{ success: boolean; data: boolean },
		{ email: string }
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
		{ success: boolean; data: boolean },
		{ token: string }
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
		{ success: boolean; data: boolean },
		{ token: string; password: string }
	>({
		url: API_ROUTES.auth.resetPassword,
		isPublic: true,
		params: {
			method: 'POST',
			body: { token: payload.token, password: payload.password },
		},
	})
}
