import {
	EAppointmentChatSystemAction,
	type IAppointmentChatMessage,
} from '@/actions/appointment-chat/models/appointment-chat-message.schema'

type TranslateFn = (key: string, options?: Record<string, unknown>) => string

function readServiceName(payload: unknown): string {
	if (
		payload &&
		typeof payload === 'object' &&
		'serviceName' in payload &&
		typeof (payload as { serviceName: unknown }).serviceName === 'string'
	) {
		return (payload as { serviceName: string }).serviceName
	}
	return ''
}

export function formatSystemChatMessage(
	message: IAppointmentChatMessage,
	t: TranslateFn,
): string {
	const serviceName = readServiceName(message.payload)

	switch (message.systemAction) {
		case EAppointmentChatSystemAction.APPOINTMENT_CREATED:
			return t('systemAppointmentCreated', { serviceName })
		case EAppointmentChatSystemAction.APPOINTMENT_CONFIRMED:
			return t('systemAppointmentConfirmed', { serviceName })
		case EAppointmentChatSystemAction.APPOINTMENT_CANCELLED:
			return t('systemAppointmentCancelled', { serviceName })
		default:
			return message.body ?? ''
	}
}
