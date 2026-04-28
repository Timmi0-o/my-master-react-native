import * as SecureStore from 'expo-secure-store'

const KEYS = {
	accessToken: 'auth.accessToken',
	sid: 'auth.sid',
} as const

export interface IPersistedSession {
	accessToken: string
	sid: string
}

export const authStorage = {
	async read(): Promise<IPersistedSession | null> {
		const [accessToken, sid] = await Promise.all([
			SecureStore.getItemAsync(KEYS.accessToken),
			SecureStore.getItemAsync(KEYS.sid),
		])
		if (!accessToken || !sid) return null
		return { accessToken, sid }
	},

	async write(session: IPersistedSession): Promise<void> {
		await Promise.all([
			SecureStore.setItemAsync(KEYS.accessToken, session.accessToken),
			SecureStore.setItemAsync(KEYS.sid, session.sid),
		])
	},

	async clear(): Promise<void> {
		await Promise.all([
			SecureStore.deleteItemAsync(KEYS.accessToken),
			SecureStore.deleteItemAsync(KEYS.sid),
		])
	},
}
