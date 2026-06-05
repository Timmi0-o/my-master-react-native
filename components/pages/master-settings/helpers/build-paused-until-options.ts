import {
	type AppLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'

export interface IPausedUntilOption {
	value: string
	label: string
}

const PAUSED_UNTIL_DAYS_COUNT = 90
const PAUSED_UNTIL_TIME_STEP_MINUTES = 30

export interface IBuildLocalDateTimeDateOptionsParams {
	pastDays?: number
	futureDays?: number
}

export interface IBuildLocalDateTimeTimeOptionsParams {
	enforceFutureForToday?: boolean
}

export function formatPausedUntilDateKey(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

export function formatPausedUntilTimeKey(date: Date): string {
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${hours}:${minutes}`
}

export function formatPausedUntilValue(date: Date): string {
	return `${formatPausedUntilDateKey(date)} ${formatPausedUntilTimeKey(date)}`
}

export function parsePausedUntilValue(value: string): Date {
	if (!value.trim()) {
		const nextSlot = new Date()
		nextSlot.setSeconds(0, 0)
		nextSlot.setMinutes(
			Math.ceil(nextSlot.getMinutes() / PAUSED_UNTIL_TIME_STEP_MINUTES) *
				PAUSED_UNTIL_TIME_STEP_MINUTES,
		)

		if (nextSlot.getMinutes() >= 60) {
			nextSlot.setMinutes(0)
			nextSlot.setHours(nextSlot.getHours() + 1)
		}

		return nextSlot
	}

	const parsed = new Date(value.trim().replace(' ', 'T'))

	if (Number.isNaN(parsed.getTime())) {
		return parsePausedUntilValue('')
	}

	return parsed
}

export function formatPausedUntilLabel(
	value: string,
	locale: AppLocale,
): string {
	if (!value.trim()) {
		return ''
	}

	const parsed = parsePausedUntilValue(value)

	return parsed.toLocaleString(toDateTimeLocale(locale), {
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

export function isoToLocalDateTimeValue(iso: string): string {
	const date = new Date(iso)

	if (Number.isNaN(date.getTime())) {
		return ''
	}

	return formatPausedUntilValue(date)
}

export function localDateTimeValueToIso(value: string): string {
	return new Date(value.trim().replace(' ', 'T')).toISOString()
}

export function buildLocalDateTimeDateOptions(
	locale: AppLocale,
	params: IBuildLocalDateTimeDateOptionsParams = {
		pastDays: 0,
		futureDays: PAUSED_UNTIL_DAYS_COUNT,
	},
): IPausedUntilOption[] {
	const dateTimeLocale = toDateTimeLocale(locale)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const currentYear = today.getFullYear()
	const pastDays = params.pastDays ?? 0
	const futureDays = params.futureDays ?? PAUSED_UNTIL_DAYS_COUNT
	const options: IPausedUntilOption[] = []

	for (let dayOffset = -pastDays; dayOffset <= futureDays; dayOffset += 1) {
		const date = new Date(today)
		date.setDate(today.getDate() + dayOffset)

		options.push({
			value: formatPausedUntilDateKey(date),
			label: date.toLocaleDateString(dateTimeLocale, {
				day: 'numeric',
				month: 'short',
				weekday: 'short',
				...(date.getFullYear() !== currentYear ? { year: 'numeric' } : {}),
			}),
		})
	}

	return options
}

export function buildLocalDateTimeTimeOptions(
	dateKey: string,
	params: IBuildLocalDateTimeTimeOptionsParams = {},
): IPausedUntilOption[] {
	const enforceFutureForToday = params.enforceFutureForToday ?? false
	const now = new Date()
	const isToday = dateKey === formatPausedUntilDateKey(now)
	const minTotalMinutes =
		enforceFutureForToday && isToday
			? now.getHours() * 60 + now.getMinutes()
			: -1
	const options: IPausedUntilOption[] = []

	for (let hour = 0; hour < 24; hour += 1) {
		for (
			let minute = 0;
			minute < 60;
			minute += PAUSED_UNTIL_TIME_STEP_MINUTES
		) {
			const totalMinutes = hour * 60 + minute

			if (minTotalMinutes >= 0 && totalMinutes <= minTotalMinutes) {
				continue
			}

			const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

			options.push({ value, label: value })
		}
	}

	if (options.length === 0) {
		return [{ value: '23:30', label: '23:30' }]
	}

	return options
}

export function buildTimeOfDayOptions(): IPausedUntilOption[] {
	return buildLocalDateTimeTimeOptions('2099-01-01')
}

export function buildPausedUntilDateOptions(
	locale: AppLocale,
): IPausedUntilOption[] {
	return buildLocalDateTimeDateOptions(locale, {
		pastDays: 0,
		futureDays: PAUSED_UNTIL_DAYS_COUNT,
	})
}

export function buildPausedUntilTimeOptions(
	dateKey: string,
): IPausedUntilOption[] {
	return buildLocalDateTimeTimeOptions(dateKey, {
		enforceFutureForToday: true,
	})
}

export function combinePausedUntilValue(
	dateKey: string,
	timeKey: string,
): string {
	return `${dateKey} ${timeKey}`
}
