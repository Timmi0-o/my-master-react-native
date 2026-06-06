import { i18n } from '@/configs/i18n/i18n'
import { scopedT } from '@/configs/i18n/scoped-t'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'

export interface IFormattedDate {
	day: string
	month: string
	full: string
}

const getIntlLocale = (): string =>
	toDateTimeLocale(resolveLocale(i18n.language))

const formatShortMonth = (
	year: number,
	monthIndex: number,
	day: number,
): string => {
	try {
		return new Intl.DateTimeFormat(getIntlLocale(), { month: 'short' }).format(
			new Date(year, monthIndex, day),
		)
	} catch {
		return scopedT('invalidDate', 'common', 'fallback')
	}
}

export function formatDate(date: string): IFormattedDate {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)

	if (!match) {
		return {
			day: '--',
			month: scopedT('invalidDate', 'common', 'fallback'),
			full: date,
		}
	}

	const [, year, month, day] = match
	const yearNumber = Number(year)
	const monthIndex = Number(month) - 1
	const dayNumber = Number(day)

	if (!isValidDateParts(yearNumber, monthIndex, dayNumber)) {
		return {
			day: '--',
			month: scopedT('invalidDate', 'common', 'fallback'),
			full: date,
		}
	}

	return {
		day: String(dayNumber).padStart(2, '0'),
		month: formatShortMonth(yearNumber, monthIndex, dayNumber),
		full: `${day.padStart(2, '0')}.${month}.${year}`,
	}
}

function isValidDateParts(
	year: number,
	monthIndex: number,
	day: number,
): boolean {
	if (monthIndex < 0 || monthIndex > 11 || day < 1) {
		return false
	}

	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

	return day <= daysInMonth
}

/** Дата и время для таймлайна: «ДД.ММ.ГГГГ – ЧЧ:ММ». */
export const FormatDateTime = (dateObject: Date): string => {
	const datePart = dateObject.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	const timePart = dateObject.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})

	return `${datePart} – ${timePart}`
}

/** ISO date-time (например `startsAt` с API) → «ЧЧ:ММ» в локали пользователя. */
export function formatTimeByDate(dateTime: string): string {
	const dateObject = new Date(dateTime)

	if (Number.isNaN(dateObject.getTime())) {
		return dateTime
	}

	return new Intl.DateTimeFormat(getIntlLocale(), {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(dateObject)
}
