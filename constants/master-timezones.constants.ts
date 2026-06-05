export const MASTER_TIMEZONE_IDS = [
	'Europe/Kaliningrad',
	'Europe/Moscow',
	'Europe/Simferopol',
	'Europe/Volgograd',
	'Europe/Astrakhan',
	'Europe/Samara',
	'Asia/Yekaterinburg',
	'Asia/Omsk',
	'Asia/Novosibirsk',
	'Asia/Barnaul',
	'Asia/Tomsk',
	'Asia/Krasnoyarsk',
	'Asia/Irkutsk',
	'Asia/Chita',
	'Asia/Yakutsk',
	'Asia/Vladivostok',
	'Asia/Magadan',
	'Asia/Sakhalin',
	'Asia/Kamchatka',
	'Asia/Anadyr',
] as const

export type TMasterTimezoneId = (typeof MASTER_TIMEZONE_IDS)[number]

export const DEFAULT_MASTER_TIMEZONE: TMasterTimezoneId = 'Europe/Moscow'

export function resolveMasterTimezone(
	timezone: string | undefined,
): TMasterTimezoneId {
	if (
		timezone &&
		(MASTER_TIMEZONE_IDS as readonly string[]).includes(timezone)
	) {
		return timezone as TMasterTimezoneId
	}

	return DEFAULT_MASTER_TIMEZONE
}

export function formatMasterTimezoneLabel(
	timezoneId: string,
	locale: string,
): string {
	const city =
		timezoneId.split('/').pop()?.replace(/_/g, ' ') ?? timezoneId

	try {
		const offset = new Intl.DateTimeFormat(locale, {
			timeZone: timezoneId,
			timeZoneName: 'shortOffset',
		})
			.formatToParts(new Date())
			.find((part) => part.type === 'timeZoneName')?.value

		return offset ? `${city} (${offset})` : city
	} catch {
		return city
	}
}

export function buildMasterTimezoneOptions(locale: string): {
	value: TMasterTimezoneId
	label: string
}[] {
	return MASTER_TIMEZONE_IDS.map((timezoneId) => ({
		value: timezoneId,
		label: formatMasterTimezoneLabel(timezoneId, locale),
	}))
}
