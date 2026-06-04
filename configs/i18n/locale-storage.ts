import { platformStorage } from '@/configs/platform-storage'
import { type AppLocale, isAppLocale } from './supported-locales'

const LOCALE_KEY = 'app.locale'

export const localeStorage = {
	async readLocale(): Promise<AppLocale | null> {
		const value = await platformStorage.getItem(LOCALE_KEY)
		if (value && isAppLocale(value)) {
			return value
		}
		return null
	},

	async writeLocale(locale: AppLocale): Promise<void> {
		await platformStorage.setItem(LOCALE_KEY, locale)
	},
}
