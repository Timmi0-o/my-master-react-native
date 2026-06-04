import { platformStorage } from '@/configs/platform-storage'
import {
	type ActiveProfileMode,
	isActiveProfileMode,
} from './active-profile-mode.types'

const ACTIVE_PROFILE_MODE_KEY = 'app.activeProfileMode'

export const activeProfileModeStorage = {
	async readMode(): Promise<ActiveProfileMode | null> {
		const value = await platformStorage.getItem(ACTIVE_PROFILE_MODE_KEY)
		return isActiveProfileMode(value) ? value : null
	},

	async writeMode(mode: ActiveProfileMode): Promise<void> {
		await platformStorage.setItem(ACTIVE_PROFILE_MODE_KEY, mode)
	},
}
