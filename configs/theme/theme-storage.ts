import { platformStorage } from '@/configs/platform-storage'

const THEME_MODE_KEY = 'app.theme.mode'

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
}
