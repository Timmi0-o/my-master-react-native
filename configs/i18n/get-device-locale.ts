import {
	DEFAULT_LOCALE,
	resolveLocale,
	type AppLocale,
} from './supported-locales'
import { requireOptionalNativeModule } from 'expo-modules-core'
import { NativeModules, Platform } from 'react-native'

type IExpoLocalizationNativeModule = {
	getLocales: () => { languageCode?: string | null }[]
}

const readExpoLocalizationLanguageCode = (): string | undefined => {
	const localization =
		requireOptionalNativeModule<IExpoLocalizationNativeModule>(
			'ExpoLocalization',
		)

	if (!localization?.getLocales) {
		return undefined
	}

	try {
		return localization.getLocales()[0]?.languageCode ?? undefined
	} catch {
		return undefined
	}
}

const readReactNativeLanguageCode = (): string | undefined => {
	if (Platform.OS === 'ios') {
		const settings = NativeModules.SettingsManager?.settings as
			| {
					AppleLocale?: string
					AppleLanguages?: string[]
			  }
			| undefined

		return settings?.AppleLocale ?? settings?.AppleLanguages?.[0]
	}

	if (Platform.OS === 'android') {
		return NativeModules.I18nManager?.localeIdentifier as string | undefined
	}

	if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
		return navigator.language
	}

	return undefined
}

export const getDeviceLocale = (): AppLocale => {
	const code =
		readExpoLocalizationLanguageCode() ?? readReactNativeLanguageCode()

	return resolveLocale(code)
}

export const getDeviceLocaleOrDefault = (): AppLocale => {
	try {
		return getDeviceLocale()
	} catch {
		return DEFAULT_LOCALE
	}
}
