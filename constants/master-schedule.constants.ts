import type { TDayOfWeek } from '@/actions/master-weekly-schedule/models/master-weekly-schedule.schema'
import type { TMasterBookingStatus } from '@/actions/master/models/master-profile.schema'
import type { TMasterScheduleExceptionKind } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'

export const DAY_OF_WEEK_LABELS: Record<TDayOfWeek, string> = {
	MONDAY: 'Понедельник',
	TUESDAY: 'Вторник',
	WEDNESDAY: 'Среда',
	THURSDAY: 'Четверг',
	FRIDAY: 'Пятница',
	SATURDAY: 'Суббота',
	SUNDAY: 'Воскресенье',
}

export const DAY_OF_WEEK_ORDER: TDayOfWeek[] = [
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
	'SUNDAY',
]

export const BOOKING_STATUS_LABELS: Record<TMasterBookingStatus, string> = {
	ACCEPTING: 'Принимаю записи',
	PAUSED: 'Временно не принимаю',
	CLOSED: 'Закрыт для записи',
}

export const EXCEPTION_KIND_LABELS: Record<TMasterScheduleExceptionKind, string> = {
	CLOSED: 'Выходной / недоступен',
	CUSTOM_HOURS: 'Особые часы',
}
