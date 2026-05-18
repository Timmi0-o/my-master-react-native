const MONTHS_SHORT = [
	'янв',
	'фев',
	'мар',
	'апр',
	'май',
	'июн',
	'июл',
	'авг',
	'сен',
	'окт',
	'ноя',
	'дек',
] as const

export interface IFormattedRecordDate {
	day: string
	month: string
	full: string
}

export function formatRecordDate(date: string): IFormattedRecordDate {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)

	if (!match) {
		return {
			day: '--',
			month: 'дата',
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
			month: 'дата',
			full: date,
		}
	}

	return {
		day: String(dayNumber).padStart(2, '0'),
		month: MONTHS_SHORT[monthIndex],
		full: `${day.padStart(2, '0')}.${month}.${year}`,
	}
}

function isValidDateParts(
	year: number,
	monthIndex: number,
	day: number,
): boolean {
	if (monthIndex < 0 || monthIndex >= MONTHS_SHORT.length || day < 1) {
		return false
	}

	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

	return day <= daysInMonth
}
