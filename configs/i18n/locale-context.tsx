import { i18n } from '@/configs/i18n/i18n'
import { localeStorage } from '@/configs/i18n/locale-storage'
import { getDeviceLocaleOrDefault } from '@/configs/i18n/get-device-locale'
import {
	DEFAULT_LOCALE,
	type AppLocale,
} from '@/configs/i18n/supported-locales'
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

interface ILocaleContextValue {
	locale: AppLocale
	setLocale: (locale: AppLocale) => Promise<void>
	isHydrated: boolean
}

const LocaleContext = createContext<ILocaleContextValue | null>(null)

export const LocaleProviderApp = ({ children }: { children: ReactNode }) => {
	const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE)
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		localeStorage
			.readLocale()
			.then(async (persisted) => {
				const next = persisted ?? getDeviceLocaleOrDefault()
				setLocaleState(next)
				await i18n.changeLanguage(next)
			})
			.catch(() => {})
			.finally(() => {
				setIsHydrated(true)
			})
	}, [])

	const setLocale = useCallback(async (nextLocale: AppLocale): Promise<void> => {
		setLocaleState(nextLocale)
		await i18n.changeLanguage(nextLocale)
		await localeStorage.writeLocale(nextLocale)
	}, [])

	const value = useMemo<ILocaleContextValue>(
		() => ({
			locale,
			setLocale,
			isHydrated,
		}),
		[isHydrated, locale, setLocale],
	)

	return (
		<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
	)
}

export const useAppLocale = (): ILocaleContextValue => {
	const context = useContext(LocaleContext)
	if (!context) {
		throw new Error('useAppLocale must be used within LocaleProviderApp')
	}
	return context
}
