import { i18n } from '@/configs/i18n/i18n'
import { scopedT } from '@/configs/i18n/scoped-t'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { formatDate } from '@/utils/format-date.util'

const getIntlLocale = (): string =>
	toDateTimeLocale(resolveLocale(i18n.language))

const getLocalDateKey = (date: Date): string => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

const isTodayDateKey = (dateKey: string): boolean =>
	dateKey === getLocalDateKey(new Date())

/** Заголовок группы записей: «Сегодня» или полная дата. */
export function formatAppointmentGroupLabel(dateKey: string): string {
	if (isTodayDateKey(dateKey)) {
		return scopedT('today', 'common', 'date')
	}

	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey)

	if (!match) {
		return dateKey
	}

	const [, year, month, day] = match
	const dateObject = new Date(Number(year), Number(month) - 1, Number(day))

	if (Number.isNaN(dateObject.getTime())) {
		return dateKey
	}

	try {
		return new Intl.DateTimeFormat(getIntlLocale(), {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(dateObject)
	} catch {
		return formatDate(dateKey).full
	}
}
