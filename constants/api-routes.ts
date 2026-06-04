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
		me: `${API_URL}/master-profiles/me`,
		one: (id: string) => `${API_URL}/master-profiles/${id}`,
	},
	masterServices: {
		many: `${API_URL}/master-services`,
	},
	userProfiles: {
		many: `${API_URL}/user-profiles`,
		me: `${API_URL}/user-profiles/me`,
		one: (id: string) => `${API_URL}/user-profiles/${id}`,
	},
	appointments: {
		me: `${API_URL}/appointments/me`,
		myClients: `${API_URL}/appointments/my-clients`,
	},
	appointmentChats: {
		one: (id: string) => `${API_URL}/appointment-chats/${id}`,
	},
	appointmentChatMessages: {
		many: `${API_URL}/appointment-chat-messages`,
	},
} as const
