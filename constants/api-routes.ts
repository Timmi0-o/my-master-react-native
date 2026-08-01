const API_URL = process.env.EXPO_PUBLIC_API_URL

export const API_ROUTES = {
	auth: {
		login: `${API_URL}/auth/login`,
		register: `${API_URL}/auth/register`,
		refresh: `${API_URL}/auth/refresh`,
		logout: `${API_URL}/auth/logout`,
		me: `${API_URL}/auth/me`,
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
		my: `${API_URL}/master-services/my`,
		one: (id: string) => `${API_URL}/master-services/${id}`,
		availableSlots: (id: string) =>
			`${API_URL}/master-services/${id}/available-slots`,
		presignImages: (id: string) =>
			`${API_URL}/master-services/${id}/images/presign`,
		deleteImages: (id: string) => `${API_URL}/master-services/${id}/images`,
	},
	appointments: {
		me: `${API_URL}/appointments/me`,
		myClients: `${API_URL}/appointments/my-clients`,
		many: `${API_URL}/appointments`,
		one: (id: string) => `${API_URL}/appointments/${id}`,
	},
	masterWeeklySchedules: {
		many: `${API_URL}/master-weekly-schedules`,
		one: (id: string) => `${API_URL}/master-weekly-schedules/${id}`,
	},
	masterScheduleExceptions: {
		many: `${API_URL}/master-schedule-exceptions`,
		one: (id: string) => `${API_URL}/master-schedule-exceptions/${id}`,
	},
	masterServiceReviews: {
		many: `${API_URL}/master-service-reviews`,
		one: (id: string) => `${API_URL}/master-service-reviews/${id}`,
	},
	userProfiles: {
		many: `${API_URL}/user-profiles`,
		me: `${API_URL}/user-profiles/me`,
		one: (id: string) => `${API_URL}/user-profiles/${id}`,
	},
	users: {
		updateOwnLanguage: `${API_URL}/users/me/language`,
	},
	appointmentChats: {
		one: (id: string) => `${API_URL}/appointment-chats/${id}`,
	},
	appointmentChatMessages: {
		many: `${API_URL}/appointment-chat-messages`,
	},
} as const
