import {
	isAppLocale,
	type AppLocale,
	SUPPORTED_LOCALES,
} from '@/configs/i18n/supported-locales'

export const API_LANGUAGES = {
	RU: 'RU',
	EN: 'EN',
	ES: 'ES',
	ZH: 'ZH',
	AR: 'AR',
	FR: 'FR',
	DE: 'DE',
	PT: 'PT',
	JA: 'JA',
	HI: 'HI',
} as const

export type ApiLanguage = (typeof API_LANGUAGES)[keyof typeof API_LANGUAGES]

const APP_LOCALE_TO_API: Record<AppLocale, ApiLanguage> = {
	en: API_LANGUAGES.EN,
	ru: API_LANGUAGES.RU,
	es: API_LANGUAGES.ES,
	zh: API_LANGUAGES.ZH,
	ar: API_LANGUAGES.AR,
}

const API_TO_APP_LOCALE: Partial<Record<ApiLanguage, AppLocale>> = {
	[API_LANGUAGES.EN]: 'en',
	[API_LANGUAGES.RU]: 'ru',
	[API_LANGUAGES.ES]: 'es',
	[API_LANGUAGES.ZH]: 'zh',
	[API_LANGUAGES.AR]: 'ar',
}

export const appLocaleToApiLanguage = (locale: string): ApiLanguage => {
	if (isAppLocale(locale)) {
		return APP_LOCALE_TO_API[locale]
	}
	return API_LANGUAGES.RU
}

export const apiLanguageToAppLocale = (language: string): AppLocale => {
	const mapped = API_TO_APP_LOCALE[language as ApiLanguage]
	if (mapped && SUPPORTED_LOCALES.includes(mapped)) {
		return mapped
	}
	return 'ru'
}
