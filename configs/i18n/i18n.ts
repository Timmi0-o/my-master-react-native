import { I18N_NAMESPACES } from '@/configs/i18n/i18n-namespaces'
import { localeResources } from '@/configs/i18n/locale-resources'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE } from './supported-locales'

void i18n.use(initReactI18next).init({
	resources: localeResources,
	// Язык устройства выставляется в LocaleProviderApp после mount.
	lng: DEFAULT_LOCALE,
	fallbackLng: DEFAULT_LOCALE,
	defaultNS: 'common',
	ns: [...I18N_NAMESPACES],
	interpolation: {
		escapeValue: false,
	},
	compatibilityJSON: 'v4',
})

export { i18n }
