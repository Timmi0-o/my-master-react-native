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
import { ColorSchemeName, useColorScheme } from 'react-native'
import { Uniwind } from 'uniwind'
import {
	AccentPaletteId,
	applyAccentPalette,
	DEFAULT_ACCENT_PALETTE_ID,
	getAccentPaletteById,
} from './accent-palettes'
import { ThemeMode, themeStorage } from './theme-storage'

const toResolvedColorScheme = (
	scheme: ColorSchemeName | null | undefined,
): 'light' | 'dark' => (scheme === 'dark' ? 'dark' : 'light')

interface IThemeContextValue {
	mode: ThemeMode
	resolvedColorScheme: 'light' | 'dark'
	accentId: AccentPaletteId
	setMode: (mode: ThemeMode) => Promise<void>
	setDarkModeEnabled: (enabled: boolean) => Promise<void>
	setAccentId: (accentId: AccentPaletteId) => Promise<void>
}

const ThemeContext = createContext<IThemeContextValue | null>(null)

export const ThemeProviderApp = ({ children }: { children: ReactNode }) => {
	const systemColorScheme = toResolvedColorScheme(useColorScheme())
	const [mode, setModeState] = useState<ThemeMode>('system')
	const [accentId, setAccentIdState] = useState<AccentPaletteId>(
		DEFAULT_ACCENT_PALETTE_ID,
	)

	const resolvedColorScheme: 'light' | 'dark' =
		mode === 'system' ? systemColorScheme : mode

	useEffect(() => {
		Promise.all([themeStorage.readMode(), themeStorage.readAccent()])
			.then(([persistedMode, persistedAccent]) => {
				if (persistedMode) {
					setModeState(persistedMode)
				}
				if (persistedAccent) {
					setAccentIdState(persistedAccent)
				}
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		Uniwind.setTheme(resolvedColorScheme)
		applyAccentPalette(getAccentPaletteById(accentId))
		SystemUI.setBackgroundColorAsync(
			THEME_BACKGROUND_COLORS[resolvedColorScheme],
		).catch(() => {})
	}, [resolvedColorScheme, accentId])

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

	const setAccentId = useCallback(
		async (nextAccentId: AccentPaletteId): Promise<void> => {
			setAccentIdState(nextAccentId)
			await themeStorage.writeAccent(nextAccentId)
		},
		[],
	)

	const value = useMemo<IThemeContextValue>(
		() => ({
			mode,
			resolvedColorScheme,
			accentId,
			setMode,
			setDarkModeEnabled,
			setAccentId,
		}),
		[accentId, mode, resolvedColorScheme, setAccentId, setDarkModeEnabled, setMode],
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
