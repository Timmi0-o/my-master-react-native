const API_URL = process.env.EXPO_PUBLIC_API_URL

export const API_ROUTES = {
	auth: {
		login: `${API_URL}/auth/login`,
		refresh: `${API_URL}/auth/refresh`,
		logout: `${API_URL}/auth/logout`,
		validateResetPasswordToken: `${API_URL}/auth/validate-reset-password-token`,
		resetPassword: `${API_URL}/auth/reset-password`,
		requestResetPassword: `${API_URL}/auth/send-reset-password-email`,
	},
	masterProfiles: {
		many: `${API_URL}/master-profiles`,
	},
	masterServices: {
		many: `${API_URL}/master-services`,
	},
} as const
