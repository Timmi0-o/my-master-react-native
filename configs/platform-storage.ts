import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

type WebStorage = {
	getItem: (key: string) => string | null
	setItem: (key: string, value: string) => void
	removeItem: (key: string) => void
}

const getWebStorage = (): WebStorage | null => {
	const storage = (globalThis as typeof globalThis & { localStorage?: WebStorage })
		.localStorage

	return storage ?? null
}

export const platformStorage = {
	async getItem(key: string): Promise<string | null> {
		if (Platform.OS !== 'web') {
			return SecureStore.getItemAsync(key)
		}

		try {
			return getWebStorage()?.getItem(key) ?? null
		} catch {
			return null
		}
	},

	async setItem(key: string, value: string): Promise<void> {
		if (Platform.OS !== 'web') {
			await SecureStore.setItemAsync(key, value)
			return
		}

		const storage = getWebStorage()
		if (!storage) {
			throw new Error('Web storage is unavailable')
		}

		storage.setItem(key, value)
	},

	async deleteItem(key: string): Promise<void> {
		if (Platform.OS !== 'web') {
			await SecureStore.deleteItemAsync(key)
			return
		}

		getWebStorage()?.removeItem(key)
	},
}
