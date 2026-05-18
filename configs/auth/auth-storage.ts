import { platformStorage } from '@/configs/platform-storage'

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
			platformStorage.getItem(KEYS.accessToken),
			platformStorage.getItem(KEYS.refreshToken),
			platformStorage.getItem(KEYS.legacySid),
		])
		const actualRefreshToken = refreshToken ?? legacySid
		if (!accessToken || !actualRefreshToken) return null
		return { accessToken, refreshToken: actualRefreshToken }
	},

	async write(session: IPersistedSession): Promise<void> {
		await Promise.all([
			platformStorage.setItem(KEYS.accessToken, session.accessToken),
			platformStorage.setItem(KEYS.refreshToken, session.refreshToken),
			platformStorage.deleteItem(KEYS.legacySid),
		])
	},

	async clear(): Promise<void> {
		await Promise.all([
			platformStorage.deleteItem(KEYS.accessToken),
			platformStorage.deleteItem(KEYS.refreshToken),
			platformStorage.deleteItem(KEYS.legacySid),
		])
	},
}
