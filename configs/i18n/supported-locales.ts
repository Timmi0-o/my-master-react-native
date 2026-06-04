export const SUPPORTED_LOCALES = ['en', 'ru', 'es', 'zh', 'ar'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'ru'

/** Native labels for the language picker (always shown in the target language). */
export const LOCALE_OPTIONS: ReadonlyArray<{
	locale: AppLocale
	label: string
}> = [
	{ locale: 'en', label: 'English' },
	{ locale: 'ru', label: 'Русский' },
	{ locale: 'es', label: 'Español' },
	{ locale: 'zh', label: '中文' },
	{ locale: 'ar', label: 'العربية' },
]

export const isAppLocale = (value: string): value is AppLocale =>
	SUPPORTED_LOCALES.includes(value as AppLocale)

const LOCALE_BY_LANGUAGE_CODE: Record<string, AppLocale> = {
	en: 'en',
	ru: 'ru',
	es: 'es',
	zh: 'zh',
	ar: 'ar',
}

export const resolveLocale = (
	code: string | null | undefined,
): AppLocale => {
	if (!code) {
		return DEFAULT_LOCALE
	}

	const normalized = code.split('-')[0]?.toLowerCase()
	if (normalized && normalized in LOCALE_BY_LANGUAGE_CODE) {
		return LOCALE_BY_LANGUAGE_CODE[normalized]
	}

	return DEFAULT_LOCALE
}

const DATE_TIME_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
	en: 'en-US',
	ru: 'ru-RU',
	es: 'es-ES',
	zh: 'zh-CN',
	ar: 'ar-SA',
}

/** BCP 47 tag for `Intl` / `toLocaleString`. */
export const toDateTimeLocale = (locale: AppLocale): string =>
	DATE_TIME_LOCALE_BY_APP_LOCALE[locale]
