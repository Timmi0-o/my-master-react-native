import arCommon from '@/locales/ar/common.json'
import arPages from '@/locales/ar/pages.json'
import arUi from '@/locales/ar/ui.json'
import enCommon from '@/locales/en/common.json'
import enPages from '@/locales/en/pages.json'
import enUi from '@/locales/en/ui.json'
import esCommon from '@/locales/es/common.json'
import esPages from '@/locales/es/pages.json'
import esUi from '@/locales/es/ui.json'
import ruCommon from '@/locales/ru/common.json'
import ruPages from '@/locales/ru/pages.json'
import ruUi from '@/locales/ru/ui.json'
import zhCommon from '@/locales/zh/common.json'
import zhPages from '@/locales/zh/pages.json'
import zhUi from '@/locales/zh/ui.json'
import type { I18nNamespace } from './i18n-namespaces'
import { SUPPORTED_LOCALES, type AppLocale } from './supported-locales'

type LocaleResources = Record<I18nNamespace, object>

const RESOURCES_BY_LOCALE: Record<AppLocale, LocaleResources> = {
	ar: { common: arCommon, pages: arPages, ui: arUi },
	en: { common: enCommon, pages: enPages, ui: enUi },
	es: { common: esCommon, pages: esPages, ui: esUi },
	ru: { common: ruCommon, pages: ruPages, ui: ruUi },
	zh: { common: zhCommon, pages: zhPages, ui: zhUi },
}

export const localeResources = SUPPORTED_LOCALES.reduce(
	(acc, locale) => {
		acc[locale] = RESOURCES_BY_LOCALE[locale]
		return acc
	},
	{} as Record<AppLocale, LocaleResources>,
)
