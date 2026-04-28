import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import * as SystemUI from 'expo-system-ui'
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useColorScheme } from 'react-native'
import { Uniwind } from 'uniwind'
import { ThemeMode, themeStorage } from './theme-storage'

interface IThemeContextValue {
	mode: ThemeMode
	resolvedColorScheme: 'light' | 'dark'
	setMode: (mode: ThemeMode) => Promise<void>
	setDarkModeEnabled: (enabled: boolean) => Promise<void>
}

const ThemeContext = createContext<IThemeContextValue | null>(null)

export const ThemeProviderApp = ({ children }: { children: ReactNode }) => {
	const systemColorScheme = useColorScheme() ?? 'light'
	const [mode, setModeState] = useState<ThemeMode>('system')

	const resolvedColorScheme = mode === 'system' ? systemColorScheme : mode

	useEffect(() => {
		themeStorage
			.readMode()
			.then((persisted) => {
				if (persisted) {
					setModeState(persisted)
				}
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		Uniwind.setTheme(resolvedColorScheme)
		// Paint the native root view so status bar / safe-area / nav-bar
		// zones match the active theme. Without this, those zones stay
		// at the system default (white) regardless of in-tree CSS classes.
		SystemUI.setBackgroundColorAsync(
			THEME_BACKGROUND_COLORS[resolvedColorScheme],
		).catch(() => {})
	}, [resolvedColorScheme])

	const setMode = useCallback(async (nextMode: ThemeMode): Promise<void> => {
		setModeState(nextMode)
		await themeStorage.writeMode(nextMode)
	}, [])

	const setDarkModeEnabled = useCallback(
		async (enabled: boolean): Promise<void> => {
			await setMode(enabled ? 'dark' : 'light')
		},
		[setMode],
	)

	const value = useMemo<IThemeContextValue>(
		() => ({
			mode,
			resolvedColorScheme,
			setMode,
			setDarkModeEnabled,
		}),
		[mode, resolvedColorScheme, setDarkModeEnabled, setMode],
	)

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useThemeApp = (): IThemeContextValue => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useThemeApp must be used within ThemeProviderApp')
	}
	return context
}
