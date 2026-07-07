import { platformStorage } from '@/configs/platform-storage'
import type { AccentPaletteId } from './accent-palettes'
import { isAccentPaletteId } from './accent-palettes'

const THEME_MODE_KEY = 'app.theme.mode'
const THEME_ACCENT_KEY = 'app.theme.accent'

export type ThemeMode = 'system' | 'light' | 'dark'

export const themeStorage = {
	async readMode(): Promise<ThemeMode | null> {
		const value = await platformStorage.getItem(THEME_MODE_KEY)
		if (value === 'system' || value === 'light' || value === 'dark') {
			return value
		}
		return null
	},

	async writeMode(mode: ThemeMode): Promise<void> {
		await platformStorage.setItem(THEME_MODE_KEY, mode)
	},

	async readAccent(): Promise<AccentPaletteId | null> {
		const value = await platformStorage.getItem(THEME_ACCENT_KEY)
		if (value && isAccentPaletteId(value)) {
			return value
		}
		return null
	},

	async writeAccent(accentId: AccentPaletteId): Promise<void> {
		await platformStorage.setItem(THEME_ACCENT_KEY, accentId)
	},
}
