import * as SecureStore from 'expo-secure-store'

const KEYS = {
	accessToken: 'auth.accessToken',
	refreshToken: 'auth.refreshToken',
	legacySid: 'auth.sid',
} as const

export interface IPersistedSession {
	accessToken: string
	refreshToken: string
}

export const authStorage = {
	async read(): Promise<IPersistedSession | null> {
		const [accessToken, refreshToken, legacySid] = await Promise.all([
			SecureStore.getItemAsync(KEYS.accessToken),
			SecureStore.getItemAsync(KEYS.refreshToken),
			SecureStore.getItemAsync(KEYS.legacySid),
		])
		const actualRefreshToken = refreshToken ?? legacySid
		if (!accessToken || !actualRefreshToken) return null
		return { accessToken, refreshToken: actualRefreshToken }
	},

	async write(session: IPersistedSession): Promise<void> {
		await Promise.all([
			SecureStore.setItemAsync(KEYS.accessToken, session.accessToken),
			SecureStore.setItemAsync(KEYS.refreshToken, session.refreshToken),
			SecureStore.deleteItemAsync(KEYS.legacySid),
		])
	},

	async clear(): Promise<void> {
		await Promise.all([
			SecureStore.deleteItemAsync(KEYS.accessToken),
			SecureStore.deleteItemAsync(KEYS.refreshToken),
			SecureStore.deleteItemAsync(KEYS.legacySid),
		])
	},
}
