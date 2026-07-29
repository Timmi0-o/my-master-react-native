import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { AppointmentStatusSchema } from '@/actions/appointment/models/appointment.schema'

const ACTIVE_STATUSES = new Set(AppointmentStatusSchema.options.filter(
	(status) => status === 'PENDING' || status === 'CONFIRMED',
))

const getLastActivityTime = (appointment: IAppointment): number => {
	const messages = appointment.chat?.messages ?? []

	if (messages.length > 0) {
		const latest = [...messages].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)[0]

		return new Date(latest.createdAt).getTime()
	}

	return new Date(appointment.startsAt).getTime()
}

const pickDisplayAppointment = (
	appointments: IAppointment[],
): IAppointment | null => {
	if (appointments.length === 0) {
		return null
	}

	const active = appointments.filter((appointment) =>
		ACTIVE_STATUSES.has(appointment.status),
	)
	if (active.length > 0) {
		return [...active].sort(
			(a, b) =>
				new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
		)[0]
	}

	return [...appointments].sort(
		(a, b) =>
			new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
	)[0]
}

export const getAppointmentsWithChat = (
	appointments: IAppointment[],
): IAppointment[] => {
	const withChat = appointments.filter(
		(appointment) => appointment.chat != null,
	)

	const byChatId = new Map<string, IAppointment[]>()
	for (const appointment of withChat) {
		const chatId = appointment.chat!.id
		const group = byChatId.get(chatId) ?? []
		group.push(appointment)
		byChatId.set(chatId, group)
	}

	const deduped: IAppointment[] = []
	for (const group of byChatId.values()) {
		const display = pickDisplayAppointment(group)
		if (display != null) {
			deduped.push(display)
		}
	}

	return deduped.sort(
		(a, b) => getLastActivityTime(b) - getLastActivityTime(a),
	)
}
