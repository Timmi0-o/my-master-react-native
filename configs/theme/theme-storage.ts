import * as SecureStore from 'expo-secure-store'

const THEME_MODE_KEY = 'app.theme.mode'

export type ThemeMode = 'system' | 'light' | 'dark'

export const themeStorage = {
	async readMode(): Promise<ThemeMode | null> {
		const value = await SecureStore.getItemAsync(THEME_MODE_KEY)
		if (value === 'system' || value === 'light' || value === 'dark') {
			return value
		}
		return null
	},

	async writeMode(mode: ThemeMode): Promise<void> {
		await SecureStore.setItemAsync(THEME_MODE_KEY, mode)
	},
}
