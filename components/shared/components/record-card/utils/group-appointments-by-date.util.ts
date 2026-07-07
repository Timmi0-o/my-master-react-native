import type { IAppointment } from '@/actions/appointment/models/appointment.schema'

export interface IAppointmentDateGroup {
	dateKey: string
	items: IAppointment[]
}

export function groupAppointmentsByDate(
	appointments: IAppointment[],
): IAppointmentDateGroup[] {
	const sorted = [...appointments].sort(
		(a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
	)

	const groups = new Map<string, IAppointment[]>()

	for (const appointment of sorted) {
		const dateKey = appointment.startsAt.slice(0, 10)
		const existing = groups.get(dateKey) ?? []
		existing.push(appointment)
		groups.set(dateKey, existing)
	}

	return Array.from(groups.entries())
		.sort(([left], [right]) => right.localeCompare(left))
		.map(([dateKey, items]) => ({ dateKey, items }))
}

export function limitGroupedAppointments(
	groups: IAppointmentDateGroup[],
	limit: number,
): IAppointmentDateGroup[] {
	let remaining = limit
	const result: IAppointmentDateGroup[] = []

	for (const group of groups) {
		if (remaining <= 0) {
			break
		}

		const items = group.items.slice(0, remaining)
		remaining -= items.length

		if (items.length > 0) {
			result.push({ dateKey: group.dateKey, items })
		}
	}

	return result
}
