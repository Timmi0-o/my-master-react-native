export const buildAppointmentChatWsUrl = (): string => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL
	if (!apiUrl) {
		throw new Error('EXPO_PUBLIC_API_URL is required')
	}

	const origin = apiUrl.replace(/\/v1\/?$/, '')
	return `${origin}/v1/appointment-chats`
}
