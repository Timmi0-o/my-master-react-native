import { i18n } from '@/configs/i18n/i18n'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { scopedT } from '@/configs/i18n/scoped-t'

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
